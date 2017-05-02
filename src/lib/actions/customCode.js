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

var document = require('@turbine/document');
var writeHtml = require('@turbine/write-html');
var logger = require('@turbine/logger');
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
      logger.error(error.msg);
    }
  });
};

/**
 * The custom code action. This loads and executes custom JavaScript or HTML provided by the user.
 * @param {Object} settings Action settings.
 * @param {number} settings.name The name of the action. Typically used by users to remind
 * themselves what the code is intended to do.
 * @param {string} settings.source If <code>settings.language</code> is <code>html</code> and
 * <code>settings.sequential</code> is <code>true</code>, then this will be the user's code.
 * Otherwise, it will be a relative path to the file containing the users code.
 * @param {string} settings.language The language of the user's code. Must be either
 * <code>javascript</code> or <code>html</code>.
 */
module.exports = function(settings, relatedElement, event) {
  var action = {
    settings: settings,
    relatedElement: relatedElement,
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
    writeHtml(decorateCode(action, source));
  }
};
