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

/**
 * The page info data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.attribute The attribute that should be returned.
 * @returns {string}
 */
module.exports = function(settings) {
  switch (settings.attribute) {
    case 'landingPage':
      return visitorTracking.getLandingPage();
    case 'trafficSource':
      return visitorTracking.getTrafficSource();
    case 'minutesOnSite':
      return visitorTracking.getMinutesOnSite();
    case 'sessionCount':
      return visitorTracking.getSessionCount();
    case 'sessionPageViewCount':
      return visitorTracking.getSessionPageViewCount();
    case 'lifetimePageViewCount':
      return visitorTracking.getLifetimePageViewCount();
    case 'isNewVisitor':
      return visitorTracking.getIsNewVisitor();
  }
};
