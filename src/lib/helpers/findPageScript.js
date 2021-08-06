/***************************************************************************************
 * Copyright 2021 Adobe. All rights reserved.
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

var byRegexPattern = function (regexScriptSrcPattern) {
  var scripts = document.querySelectorAll('script');

  for (var i = 0; i < scripts.length; i++) {
    var script = scripts[i];
    // Find the script that loaded our library. Take into account embed scripts migrated
    // from DTM. We'll also consider that they may have added a querystring for cache-busting
    // or whatever.
    if (regexScriptSrcPattern.test(script.src)) {
      return script;
    }
  }
};

var getTurbine = function () {
  return byRegexPattern(new RegExp(/(launch|satelliteLib)-[^\/]+.js(\?.*)?$/));
};

module.exports = {
  getTurbine: getTurbine,
  byRegexPattern: byRegexPattern
};
