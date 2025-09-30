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

// Factory for dependency injection
export function createDecorateHtmlCode({ Promise, turbine, satellite } = {}) {
  let callbackId = 0;
  const htmlCodePromises = {};

  satellite._onCustomCodeSuccess = function (callbackId) {
    const promiseHandlers = htmlCodePromises[callbackId];
    if (!promiseHandlers) {
      return;
    }
    delete htmlCodePromises[callbackId];
    promiseHandlers.resolve();
  };

  satellite._onCustomCodeFailure = function (callbackId) {
    const promiseHandlers = htmlCodePromises[callbackId];
    if (!promiseHandlers) return;
    delete htmlCodePromises[callbackId];
    promiseHandlers.reject();
  };

  const reactorCallbackIdShouldBeReplaced = function (source) {
    return source.indexOf('${reactorCallbackId}') !== -1;
  };

  const replaceCallbacksIds = function (source, callbackId) {
    return source.replace(/\${reactorCallbackId}/g, callbackId);
  };

  const isSourceLoadedFromFile = function (action) {
    return action.settings.isExternal;
  };

  return function decorateHtmlCode(action, source) {
    if (isSourceLoadedFromFile(action)) {
      source = turbine.replaceTokens(source, action.event);
    }
    let promise;
    if (reactorCallbackIdShouldBeReplaced(source)) {
      promise = new Promise(function (resolve, reject) {
        htmlCodePromises[String(callbackId)] = { resolve, reject };
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
}

// Default export for production usage
import Promise from '@adobe/reactor-promise';

let decorateHtmlCode;
if (typeof window !== 'undefined' && window.turbine && window._satellite) {
  decorateHtmlCode = createDecorateHtmlCode({
    Promise,
    turbine: window.turbine,
    satellite: window._satellite
  });
} else {
  // Export a dummy function or throw a clear error if globals are missing
  decorateHtmlCode = function () {
    throw new Error(
      'window.turbine and window._satellite must be defined to use the default export of decorateHtmlCode.'
    );
  };
}
export default decorateHtmlCode;
