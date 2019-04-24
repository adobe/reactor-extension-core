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
 * Enum for duration.
 * @readonly
 * @enum {string}
 */
var duration = {
  LIFETIME: 'lifetime',
  SESSION: 'session'
};

/**
 * Page views condition. Determines if the number of page views matches constraints.
 * @param {Object} settings Condition settings.
 * @param {comparisonOperator} settings.operator The comparison operator to use to
 * compare against count.
 * @param {number} settings.count The number of page views to compare against.
 * @param {duration} settings.duration The duration of time for which to include
 * page views.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var methodName = settings.duration === duration.LIFETIME ?
    'getLifetimePageViewCount' : 'getSessionPageViewCount';
  return compareNumbers(
    visitorTracking[methodName](),
    settings.operator,
    settings.count
  );
};
