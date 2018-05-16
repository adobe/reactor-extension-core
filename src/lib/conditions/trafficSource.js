/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
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

var textMatch = require('../helpers/textMatch');
var visitorTracking = require('../helpers/visitorTracking');

/**
 * Traffic source condition. Determines if the actual traffic source matches an acceptable traffic
 * source.
 * @param {Object} settings Condition settings.
 * @param {string} settings.source An acceptable traffic source.
 * @param {boolean} [settings.sourceIsRegex=false] Whether <code>settings.source</code> is intended
 * to be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var acceptableSource =
    settings.sourceIsRegex ? new RegExp(settings.source, 'i') : settings.source;
  return textMatch(visitorTracking.getTrafficSource(), acceptableSource);
};

