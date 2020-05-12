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

var callbackId = 0;
var htmlCodePromises = {};

window._satellite = window._satellite || {};

/**
 * Public function intended to be called by the user.
 * @param {number} callbackId The identifier passed to _satellite._onCustomCodeSuccess().
 */
window._satellite._onCustomCodeSuccess = function(callbackId) {
  var promiseHandlers = htmlCodePromises[callbackId];
  if (!promiseHandlers) {
    return;
  }

  delete htmlCodePromises[callbackId];
  promiseHandlers.resolve();
};

/**
 * Public function intended to be called by the user.
 * @param {number} callbackId The identifier passed to _satellite._onCustomCodeSuccess().
 */
window._satellite._onCustomCodeFailure = function(callbackId) {
  var promiseHandlers = htmlCodePromises[callbackId];
  if (!promiseHandlers) {
    return;
  }

  delete htmlCodePromises[callbackId];
  promiseHandlers.reject();
};

var reactorCallbackIdShouldBeReplaced = function(source) {
  return source.indexOf('${reactorCallbackId}') !== -1;
};

var replaceCallbacksIds = function(source, callbackId) {
  return source.replace(/\${reactorCallbackId}/g, callbackId);
};

var isSourceLoadedFromFile = function(action) {
  return action.settings.isExternal;
};

module.exports = function(action, source) {
  // We need to replace tokens only for sources loaded from external files. The sources from
  // inside the container are automatically taken care by Turbine.
  if (isSourceLoadedFromFile(action)) {
    source = turbine.replaceTokens(source, action.event);
  }

  var promise;

  if (reactorCallbackIdShouldBeReplaced(source)) {
    promise = new Promise(function(resolve, reject) {
      htmlCodePromises[String(callbackId)] = {
        resolve: resolve,
        reject: reject
      };
    });

    source = replaceCallbacksIds(source, callbackId);
    callbackId += 1;
  } else {
    promise = Promise.resolve();
  }

  return {
    code: source,
    promise: promise
  };
};
