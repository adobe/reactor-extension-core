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

var document = require('@adobe/reactor-document');
var matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;

var escapeForRegex = function(string) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
  }

  return string.replace(matchOperatorsRegex, '\\$&');
};

/**
 * Domain condition. Determines if the actual domain matches at least one acceptable domain.
 * @param {Object} settings Condition settings.
 * @param {string[]} settings.domains An array of acceptable domains.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var domain = document.location.hostname;

  return settings.domains.some(function(acceptableDomain) {
    // If document.location.hostname is example.com and the acceptableDomain is ample.com, the
    // condition would pass without (^|\.), which is incorrect. We can't only use ^ though because
    // if document.location.hostname is niner.example.com and the acceptableDomain is example.com,
    // the condition should pass. See the tests for examples of why this pattern is necessary.
    return domain.match(
      new RegExp('(^|\\.)' + escapeForRegex(acceptableDomain) + '$', 'i')
    );
  });
};
