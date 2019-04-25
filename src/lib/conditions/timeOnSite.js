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

var visitorTracking = require('../helpers/visitorTracking');
var compareNumbers = require('./helpers/compareNumbers');

/**
 * Time on site condition. Determines if the user has been on the site for a certain amount
 * of time.
 * @param {Object} settings Condition settings.
 * @param {number} settings.minutes The number of minutes to compare against.
 * @param {comparisonOperator} settings.operator The comparison operator to use to
 * compare against minutes.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return compareNumbers(
    visitorTracking.getMinutesOnSite(),
    settings.operator,
    settings.minutes
  );
};
