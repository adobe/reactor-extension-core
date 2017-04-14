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

var visitorTracking = require('./helpers/visitorTracking');
var textMatch = require('../helpers/textMatch');

// Visitor tracking should only run (be enabled) when a rule for the property contains a condition
// that needs it. The line below will be included in the emitted library if a rule requires this
// condition and it will be run regardless of whether the condition ever gets evaluated.
visitorTracking.enable();

/**
 * Landing page condition. Determines if the actual landing page matches an acceptable landing page.
 * @param {Object} settings Condition settings.
 * @param {string} settings.page An acceptable landing page.
 * @param {boolean} [settings.pageIsRegex=false] Whether <code>settings.page</code> is intended to
 * be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var acceptablePage = settings.pageIsRegex ? new RegExp(settings.page, 'i') : settings.page;
  return textMatch(visitorTracking.getLandingPage(), acceptablePage);
};

