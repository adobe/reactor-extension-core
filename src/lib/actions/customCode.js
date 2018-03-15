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
  // We can't use document.body because it may not be available yet.
  postscribe(document.head, source, {
    error: function(error) {
      turbine.logger.error(error.msg);
    }
  });
};

var libraryWasLoadedAsynchronously = (function() {
  // document.currentScript is not supported by IE
  if (document.currentScript) {
    return document.currentScript.async;
  } else {
    var scripts = document.querySelectorAll('script');
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      // Find the script that loaded our library. Take into account embed scripts migrated
      // from DTM. We'll also consider that they may have added a querystring for cache-busting
      // or whatever.
      if (/(launch|satelliteLib)-[^\/]+.js(\?.*)?$/.test(script.src)) {
        return script.async;
      }
    }
    // We couldn't find the Launch script, so we'll assume it was loaded asynchronously. This
    // is the safer assumption.
    return true;
  }
})();

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
    //    Library Loaded or Page Bottom event. isExternal will be false. However, keep in mind that
    //    the same rule may have other events that are not Library Loaded or Page Bottom.
    // 2. When users load a library synchronously which has a rule using the Library Loaded
    //    or Page Bottom event with a Custom Code action, they expect the custom code to be written
    //    in the document immediately after the script tag that loaded the Launch library. In other
    //    words, they expect document.write to be used. When the library is loaded asynchronously,
    //    they do not have this expectation.
    // 3. When using Postscribe, the script will always be written asynchronously and therefore end
    //    up around the bottom of the body element.
    // 4. Calls to document.write will be ignored by the browser if the Launch library is loaded
    //    asynchronously, even if the calls are made before DOMContentLoaded.
    if (libraryWasLoadedAsynchronously ||
        (event.$type !== 'core.library-loaded' && event.$type !== 'core.page-bottom')) {
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
