/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import Promise from '@adobe/reactor-promise';
let id = 0;

const decorateNonGlobalJavaScriptCode = function (action, source) {
  const runScriptFnName = '_runScript' + ++id;

  const promise = new Promise(function (resolve, reject) {
    _satellite[runScriptFnName] = function (fn) {
      delete _satellite[runScriptFnName];
      // Use Promise constructor instead of Promise.resolve() so we can
      // catch errors from custom code.
      new Promise(function (_resolve) {
        _resolve(
          fn.call(
            action.event.element,
            action.event,
            action.event.target,
            Promise
          )
        );
      }).then(resolve, reject);
    };
  });

  // The line break after the source is important in case their last line of code is a comment.
  const code =
    '<scr' +
    'ipt>_satellite["' +
    runScriptFnName +
    '"](function(event, target, Promise) {\n' +
    source +
    '\n});</scr' +
    'ipt>';

  return {
    code: code,
    promise: promise
  };
};

export default decorateNonGlobalJavaScriptCode;
