/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

var document = require('@adobe/reactor-document');
var decorateCode = require('./helpers/decorateCode');
var loadCodeSequentially = require('./helpers/loadCodeSequentially');
var postscribe = require('../../../node_modules/postscribe/dist/postscribe');


// Initially we were using `document.write` for adding custom code before the `DOMContentLoaded`
// event was fired. The custom code is embedded in the library only for `pageTop` and
// `pageBottom` events. For the other events the code would be loaded from external files.
// For loading the code from external files, we would have been forced to use promises.
// Calling `document.write` from inside a promise would have erased the page content inside
// Firefox and IE. The result was similar with what happens if you try to call `document.write`
// after the `DOMContentLoaded` event is fired. This issue forces us to use `postcribe` for any
// external custom code no matter if `DOMContentLoaded` event has fired or not.
var postscribeWrite = function(source) {
  postscribe(document.body, source, {
    error: function(error) {
      turbine.logger.error(error.msg);
    }
  });
};

var wasLibraryLoadedAsynchronously = function() {
  var scripts = document.querySelectorAll('script');
  for (var i = 0; i < scripts.length; i++) {
    var script = scripts[i];
    // Find the script that loaded our library. Take into account embed scripts migrated
    // from DTM.
    if (/(launch|satelliteLib)-[^\/]+.js$/.test(script.src)) {
      return script.async;
    }
  }
  // We couldn't find the Launch script, so we'll assume it was loaded asynchronously. This is the
  // safer assumption.
  return true;
};

var isIE10 = Boolean(document.documentElement.doScroll);

/**
 * The custom code action. This loads and executes custom JavaScript or HTML provided by the user.
 * @param {Object} settings Action settings.
 * @param {string} settings.source If <code>settings.language</code> is <code>html</code> and
 * <code>settings.sequential</code> is <code>true</code>, then this will be the user's code.
 * Otherwise, it will be a relative path to the file containing the users code.
 * @param {string} settings.language The language of the user's code. Must be either
 * @param {Object} event The underlying event object that triggered the rule.
 * @param {Object} event.element The element that the rule was targeting.
 * @param {Object} event.target The element on which the event occurred.
 * <code>javascript</code> or <code>html</code>.
 */
module.exports = function(settings, event) {
  var action = {
    settings: settings,
    event: event
  };

  var source = action.settings.source;
  if (!source) {
    return;
  }

  if (action.settings.isExternal) {
    return loadCodeSequentially(source).then(function(source) {
      if (source) {
        postscribeWrite(decorateCode(action, source));
      }
    });
  } else {
    // A few things to be aware of here:
    // 1. Custom code will be included into the main launch library if it's for a rule that uses the
    //    Library Loaded or Page Bottom event. isExternal will be false.
    // 2. When users load a library synchronously which has a rule using the Library Loaded
    //    or Page Bottom event with a Custom Code action, they expect the custom code to be written
    //    in the document immediately after the script tag that loaded the Launch library. In other
    //    words, they expect document.write to be used. When the library is loaded asynchronously,
    //    they do not have this expectation.
    // 3. When using Postscribe, the script will always be written asynchronously and therefore end
    //    up around the bottom of the body element.
    // 4. We can only use document.write before DOMContentLoaded is fired.
    // 5. When the Launch library is loaded asynchronously, it can finish loading either before
    //    or after DOMContentLoaded.
    // 6. We prefer using document.readyState to determine if DOMContentLoaded has fired, but
    //    we need to take into consideration a bug in IE 10 which sometimes sets document.readyState
    //    to 'interactive' too early (before DOMContentLoaded has fired).
    //    https://bugs.jquery.com/ticket/12282
    //    Because of this, if the browser is IE 10, we determine if we should use postscribe
    //    instead of document.write by inspecting our script element to determine if it was
    //    loaded asynchronously. If it's loaded asynchronously, we should use postscribe. If it
    //    was loaded synchronously, we should use document.write. This is a more brittle approach
    //    than using readyState (for example, the user could have renamed their Launch library
    //    file), so we only use the logic for IE 10. If we can't find our script on the page, we
    //    assume it was loaded asynchronously and use postscribe, which is probably safer than
    //    using document.write, because the code will still be executed--it just won't be executed
    //    synchronously.
    if (
      (!isIE10 && document.readyState !== 'loading') ||
      (isIE10 && wasLibraryLoadedAsynchronously())
    ) {
      postscribeWrite(decorateCode(action, source));
    } else {
      // Document object in XML files is different from the ones in HTML files. Documents served
      // with the `application/xhtml+xml` MIME type don't have the `document.write` method.
      // More info: https://www.w3.org/MarkUp/2004/xhtml-faq#docwrite or https://developer.mozilla.org/en-US/docs/Archive/Web/Writing_JavaScript_for_HTML
      if (document.write) {
        document.write(decorateCode(action, source));
      } else {
        throw new Error('Cannot write HTML to the page. `document.write` is unavailable.');
      }
    }
  }
};
