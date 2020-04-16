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
var decorateCode = require('./decorateCode');
var deferredPromise = require('./deferredPromise');

var callbackId = 0;
var deferredPromises = {};

window._satellite = window._satellite || {};

/**
 * Public function intended to be called by the user.
 * @param {number} callbackId The identifier passed to _satellite._onCustomCodeSuccess().
 */
window._satellite._onCustomCodeSuccess = function(callbackId) {
  var promiseHandlers = deferredPromises[callbackId];
  if (!promiseHandlers) {
    return;
  }

  promiseHandlers.resolve();
};

/**
 * Public function intended to be called by the user.
 * @param {number} callbackId The identifier passed to _satellite._onCustomCodeSuccess().
 */
window._satellite._onCustomCodeFailure = function(callbackId) {
  var promiseHandlers = deferredPromises[callbackId];
  if (!promiseHandlers) {
    return;
  }

  promiseHandlers.reject();
};

var reactorCallbackIdShouldBeReplaced = function(source) {
  return source.indexOf('${reactorCallbackId}') !== -1;
};

var replaceCallbacksIds = function(source, callbackId) {
  return source.replace(/\${reactorCallbackId}/g, callbackId);
};

var shouldActionBeMarkedAsComplete = function(action) {
  return action.settings.language === 'javascript' && action.settings.global;
};

module.exports = function(action, source, writeFn) {
  var p = deferredPromise();
  source = decorateCode(action, source, p);

  if (reactorCallbackIdShouldBeReplaced(source)) {
    deferredPromises[callbackId] = p;
    source = replaceCallbacksIds(source, callbackId);

    callbackId += 1;
  }

  writeFn(source);
  return shouldActionBeMarkedAsComplete(action) ? Promise.resolve() : p.promise;
};
