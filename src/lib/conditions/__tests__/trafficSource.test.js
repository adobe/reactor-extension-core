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

var mockVisitorTracking = {
  getTrafficSource: function () {
    return 'http://trafficsource.com';
  }
};

var conditionDelegateInjector = require('inject-loader!../trafficSource');
var conditionDelegate = conditionDelegateInjector({
  '../helpers/visitorTracking': mockVisitorTracking
});

var getSettings = function (source, sourceIsRegex) {
  return {
    source: source,
    sourceIsRegex: sourceIsRegex
  };
};

describe('traffic source condition delegate', function () {
  it('returns true when the traffic source matches a string', function () {
    var settings = getSettings('http://trafficsource.com', false);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the traffic source does not match a string', function () {
    var settings = getSettings('http://foo.com', false);
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the traffic source matches a regex', function () {
    var settings = getSettings('Traffic.ource', true);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the traffic source does not match a regex', function () {
    var settings = getSettings('my\\.yahoo\\.com', true);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
