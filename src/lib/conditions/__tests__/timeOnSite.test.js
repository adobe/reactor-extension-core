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

var mockVisitorTracking = {
  getMinutesOnSite: function() {
    return 5;
  }
};

var conditionDelegateInjector = require('inject-loader!../timeOnSite');
var conditionDelegate = conditionDelegateInjector({
  '../helpers/visitorTracking': mockVisitorTracking
});

var getSettings = function(minutes, operator) {
  return {
    minutes: minutes,
    operator: operator
  };
};

describe('time on site condition delegate', function() {
  it('returns true when number of minutes is above "greater than" constraint', function() {
    var settings = getSettings(4, '>');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when number of minutes is below "greater than" constraint', function() {
    var settings = getSettings(6, '>');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when number of minutes is below "less than" constraint', function() {
    var settings = getSettings(6, '<');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when number of minutes is above "less than" constraint', function() {
    var settings = getSettings(4, '<');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when number of minutes matches "equals" constraint', function() {
    var settings = getSettings(5, '=');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when number of minutes does not match "equals" constraint', function() {
    var settings = getSettings(11, '=');
    expect(conditionDelegate(settings)).toBe(false);
  });
});
