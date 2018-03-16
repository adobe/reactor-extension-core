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

var postscribeWrite = (function() {
  var write = function(source) {
    postscribe(document.body, source, {
      error: function(error) {
        turbine.logger.error(error.msg);
      }
    });
  };

  var queue = [];

  // If the Launch library is loaded asynchronously, it may finish loading before document.body
  // is available. This means the custom code action may be running before document.body is
  // available, in which case can't write the custom code to document.body. We could, in this
  // case, write it to document.head since it will for sure be available, but the user's custom
  // code may have something like an img tag for sending a beacon (this use case was seen in DTM).
  // Adding display elements like an img tag to document.head is against HTML spec, though it
  // does seem like an image request is still made. We opted instead to ensure we comply with
  // HTML spec and wait until we see that document.body is available before writing.
  var flushQueue = function() {
    if (document.body) {
      while (queue.length) {
        write(queue.shift());
      }
    } else {
      // 20 is an arbitrarily small amount of time but not too aggressive.
      setTimeout(flushQueue, 20);
    }
  };

  return function(source) {
    queue.push(source);
    flushQueue();
  };
})();

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
    //    the same rule may have other events that are not Library Loaded or Page Bottom. This means
    //    we could see isExternal = false on the action when the event that fired the rule is
    //    a click, for example.
    // 2. When users load a library synchronously which has a rule using the Library Loaded
    //    or Page Bottom event with a Custom Code action, they expect the custom code to be written
    //    to the document in a blocking fashion (prevent the parser from continuing until their
    //    custom code is executed). In other words, they expect document.write to be used. When
    //    the library is loaded asynchronously, they do not have this expectation.
    // 3. Calls to document.write will be ignored by the browser if the Launch library is loaded
    //    asynchronously, even if the calls are made before DOMContentLoaded.
    // Because of ^^^, we use document.write if the Launch library was loaded synchronously
    // and the event that fired the rule is library-loaded or page-bottom. Otherwise, we know we
    // can't use document.write and must use postscribe instead.
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
