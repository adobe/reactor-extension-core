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

var Promise = require('@adobe/reactor-promise');

var id = 0;

var isSourceLoadedFromFile = function(action) {
  return action.settings.isExternal;
};

var decorateGlobalJavaScriptCode = function(_, source) {
  // The line break after the source is important in case their last line of code is a comment.
  return '<scr' + 'ipt>\n' + source + '\n</scr' + 'ipt>';
};

var decorateNonGlobalJavaScriptCode = function(
  action,
  source,
  deferredPromise
) {
  var runScriptFnName = '__runScript' + ++id;

  _satellite[runScriptFnName] = function(fn) {
    Promise.resolve(
      fn.call(action.event.element, action.event, action.event.target)
    ).then(deferredPromise.resolve, deferredPromise.reject);

    delete _satellite[runScriptFnName];
  };

  // The line break after the source is important in case their last line of code is a comment.
  return (
    '<scr' +
    'ipt>_satellite["' +
    runScriptFnName +
    '"](function(event, target) {\n' +
    source +
    '\n})</scr' +
    'ipt>'
  );
};

var decorators = {
  javascript: function(action, source, deferredPromise) {
    return action.settings.global
      ? decorateGlobalJavaScriptCode(action, source, deferredPromise)
      : decorateNonGlobalJavaScriptCode(action, source, deferredPromise);
  },
  html: function(action, source, deferredPromise) {
    // We need to replace tokens only for sources loaded from external files. The sources from
    // inside the container are automatically taken care by Turbine.
    if (isSourceLoadedFromFile(action)) {
      return turbine.replaceTokens(source, action.event, deferredPromise);
    }

    return source;
  }
};

module.exports = function(action, source, deferredPromise) {
  return decorators[action.settings.language](action, source, deferredPromise);
};
