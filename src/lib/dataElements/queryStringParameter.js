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

var window = require('@adobe/reactor-window');
var queryString = require('@adobe/reactor-query-string');

/**
 * The query string parameter data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.name The query string parameter name.
 * @param {string} [settings.caseInsensitive] Whether casing should be ignored.
 * @returns {string}
 */
module.exports = function (settings) {
  var queryParams = queryString.parse(window.location.search);

  if (settings.caseInsensitive) {
    var lowerCaseName = settings.name.toLowerCase();
    var keys = Object.keys(queryParams);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key.toLowerCase() === lowerCaseName) {
        return queryParams[key];
      }
    }
  } else {
    return queryParams[settings.name];
  }
};
