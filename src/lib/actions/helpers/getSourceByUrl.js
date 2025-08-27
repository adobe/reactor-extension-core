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

import loadScript from '@adobe/reactor-load-script';
import Promise from '@adobe/reactor-promise';
import { byRegexPattern as findScriptByRegexPattern } from '../../helpers/findPageScript';

const codeBySourceUrl = {};
const scriptStore = {};

const loadScriptOnlyOnce = function (url) {
  if (!scriptStore[url]) {
    scriptStore[url] = loadScript(url);
  }
  return scriptStore[url];
};

_satellite.__registerScript = function (scriptGuid, code) {
  let scriptUrl;
  if (document.currentScript) {
    scriptUrl = document.currentScript.getAttribute('src');
  } else {
    const pattern = new RegExp('.*' + scriptGuid + '.*');
    scriptUrl = findScriptByRegexPattern(pattern).getAttribute('src');
  }
  codeBySourceUrl[scriptUrl] = code;
};

const getSourceByUrl = function (sourceUrl) {
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

export default getSourceByUrl;
