/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
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
var extensionSettings = turbine.getExtensionSettings();

var postscribeWrite = (function() {
  var write = function(source) {
    postscribe(document.body, source, {
      beforeWriteToken: function(tag) {
        if (extensionSettings.cspNonce && tag.tagName === 'script') {
          tag.attrs.nonce = extensionSettings.cspNonce;
        }
        return tag;
      },
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
 * @params {boolean} settings.isExternal When true, <code>settings.source</code> contains the
 * code itself. When false, <code>settings.source</code> contains a relative path to the file
 * containing the user's code.
 * @param {string} settings.source If <code>settings.external</code> is <code>false</code>,
 * this will be the user's code. Otherwise, it will be a relative path to the file containing
 * the user's code.
 * @param {string} settings.language The language of the user's code. Must be either javascript or
 * html.
 * @param {Object} event The underlying event object that triggered the rule.
 * @param {Object} event.element The element that the rule was targeting.
 * @param {Object} event.target The element on which the event occurred.
 * <code>javascript</code> or <code>html</code>.
 */
module.exports = function(settings, event) {
  var decoratedResult;

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
        decoratedResult = decorateCode(action, source);
        postscribeWrite(decoratedResult.code);
      }

      return decoratedResult.promise;
    });
  } else {
    decoratedResult = decorateCode(action, source);

    // This area has been modified several times, so here are some helpful details:
    // 1. Custom code will be included into the main launch library if it's for a rule that uses the
    //    Library Loaded or Page Bottom event. isExternal will be false. However, keep in mind that
    //    the same rule may have other events that are not Library Loaded or Page Bottom. This means
    //    we could see isExternal = false on the action when the event that fired the rule is
    //    a click, for example.
    // 2. When users load a library synchronously which has a rule using the Library Loaded
    //    or Page Bottom event with a Custom Code action, they expect the custom code to be written
    //    to the document in a blocking fashion (prevent the parser from continuing until their
    //    custom code is executed). In other words, they expect document.write to be used. When
    //    the library is loaded asynchronously, they do not have this expectation. However, note
    //    that if the Library Loaded event is used and the website does not call
    //    _satellite.pageBottom(), page bottom rules will be run when the DOMContentLoaded event
    //    is fired (at which point we can't use document.write or it will wipe out website content).
    // 3. Calls to document.write will be ignored by the browser if the Launch library is loaded
    //    asynchronously, even if the calls are made before DOMContentLoaded.
    // 4. There's a bug in IE 10 where readyState is sometimes set to "interactive" too
    //    early (before DOMContentLoaded has fired). https://bugs.jquery.com/ticket/12282
    //    This may cause Postscribe to be used sometimes when document.write() could have been
    //    used instead, but we have concluded that IE 10 usage is low enough and the risk small
    //    enough that this behavior is tolerable.
    if (!libraryWasLoadedAsynchronously && document.readyState === 'loading') {
      // Document object in XML files is different from the ones in HTML files. Documents served
      // with the `application/xhtml+xml` MIME type don't have the `document.write` method.
      // More info:
      // https://www.w3.org/MarkUp/2004/xhtml-faq#docwrite
      // https://developer.mozilla.org/en-US/docs/Archive/Web/Writing_JavaScript_for_HTML
      // Also, when rule component sequencing is enabled, there is an issue in Edge Legacy
      // where the whole page gets erased: https://jira.corp.adobe.com/browse/DTM-13527.
      // We decided to not use document.write at all when rule component sequencing is enabled.
      if (
        document.write &&
        turbine.propertySettings.ruleComponentSequencingEnabled === false
      ) {
        document.write(decoratedResult.code);
      } else {
        postscribeWrite(decoratedResult.code);
      }
    } else {
      postscribeWrite(decoratedResult.code);
    }

    return decoratedResult.promise;
  }
};
