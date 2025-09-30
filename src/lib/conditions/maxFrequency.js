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

import visitorTracking from '../helpers/visitorTracking.js';
import getNamespacedStorage from '../helpers/getNamespacedStorage.js';
const maxFrequencyLocalStorage = getNamespacedStorage(
  'localStorage',
  'maxFrequency'
);

const millisByUnit = {
  second: 1000,
  minute: 60000, // 60 seconds
  hour: 3600000, // 60 minutes
  day: 86400000, // 24 hours
  week: 604800000, // 7 days
  month: 2678400000 // 31 days
};

/**
 * Max frequency condition. Allows the condition to return true at a maximum frequency.
 * @param {Object} settings Condition settings.
 * @param {number} [settings.count] The number of units that defines the maximum frequency. This is
 * required if <code>settings.unit</code> is not <code>visitor</code> and not used if
 * <code>settings.unit</code> is <code>visitor</code>.
 * @param {string} settings.unit The unit that defines the maximum frequency.
 * @returns {boolean}
 */
export default function (settings, event) {
  // Note that our storage key incorporates the rule ID instead of the rule component ID
  // (because a rule component ID isn't available). The storage key ALSO
  // incorporates the value of settings.unit. This means that multiple Max Frequency
  // conditions on the same rule could potentially conflict by using the same key, but only
  // if they're using the same unit. This would be a very strange use case and would result
  // in unexpected behavior. For example, if a rule had two Max Frequency conditions using the
  // pageView unit and one of the conditions used a count of 3 and the other used a count of 4,
  // the actions of the rule would never be executed.
  var storageKey = event.$rule.id + '.' + settings.unit;

  switch (settings.unit) {
    case 'pageView':
      var pageViewCount = visitorTracking.getLifetimePageViewCount();
      var lastRecordedPageViewCount = Number(
        maxFrequencyLocalStorage.getItem(storageKey) || 0
      );
      if (pageViewCount - lastRecordedPageViewCount >= settings.count) {
        maxFrequencyLocalStorage.setItem(storageKey, pageViewCount);
        return true;
      }
      break;
    case 'session':
      var sessionCount = visitorTracking.getSessionCount();
      var lastRecordedSessionCount = Number(
        maxFrequencyLocalStorage.getItem(storageKey) || 0
      );
      if (sessionCount - lastRecordedSessionCount >= settings.count) {
        maxFrequencyLocalStorage.setItem(storageKey, sessionCount);
        return true;
      }
      break;
    case 'visitor':
      // We don't support settings.count for visitor because that would require a server-side
      // component to track the number of visitors.
      if (!maxFrequencyLocalStorage.getItem(storageKey)) {
        maxFrequencyLocalStorage.setItem(storageKey, 'true');
        return true;
      }
      break;
    case 'second':
    case 'minute':
    case 'hour':
    case 'day':
    case 'week':
    case 'month':
      var time = new Date().getTime();
      var lastRecordedTime = Number(
        maxFrequencyLocalStorage.getItem(storageKey) || 0
      );
      if (
        lastRecordedTime <=
        time - settings.count * millisByUnit[settings.unit]
      ) {
        maxFrequencyLocalStorage.setItem(storageKey, time);
        return true;
      }
      break;
  }

  return false;
}
