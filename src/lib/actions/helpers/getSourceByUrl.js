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
var loadScript = require('@adobe/reactor-load-script');
var Promise = require('@adobe/reactor-promise');
var findScriptByRegexPattern =
  require('../../helpers/findPageScript').byRegexPattern;

var codeBySourceUrl = {};
var scriptStore = {};

var loadScriptOnlyOnce = function (url) {
  if (!scriptStore[url]) {
    scriptStore[url] = loadScript(url);
  }

  return scriptStore[url];
};

_satellite.__registerScript = function (scriptGuid, code) {
  var scriptUrl;
  if (document.currentScript) {
    // use getAttribute in case it's a relative url
    scriptUrl = document.currentScript.getAttribute('src');
  } else {
    var pattern = new RegExp('.*' + scriptGuid + '.*');
    // use getAttribute in case it's a relative url
    scriptUrl = findScriptByRegexPattern(pattern).getAttribute('src');
  }
  codeBySourceUrl[scriptUrl] = code;
};

module.exports = function (sourceUrl) {
  if (codeBySourceUrl[sourceUrl]) {
    return Promise.resolve(codeBySourceUrl[sourceUrl]);
  } else {
    return new Promise(function (resolve) {
      loadScriptOnlyOnce(sourceUrl).then(
        function () {
          resolve(codeBySourceUrl[sourceUrl]);
        },
        function () {
          resolve();
        }
      );
    });
  }
};
