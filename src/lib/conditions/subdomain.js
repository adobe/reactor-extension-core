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
var textMatch = require('../helpers/textMatch');

/**
 * Subdomain condition. Determines if the actual subdomain matches at least one acceptable
 * subdomain.
 * @param {Object} settings Condition settings.
 * @param {Object[]} settings.subdomains Acceptable subdomains.
 * @param {string} settings.subdomains[].value An acceptable subdomain value.
 * @param {boolean} [settings.subdomains[].valueIsRegex=false] Whether <code>value</code> on the
 * object instance is intended to be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var subdomain = document.location.hostname;
  return settings.subdomains.some(function(acceptableSubdomain) {
    var acceptableValue = acceptableSubdomain.valueIsRegex ?
      new RegExp(acceptableSubdomain.value, 'i') : acceptableSubdomain.value;
    return textMatch(subdomain, acceptableValue);
  });
};

