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

var mockVisitorTracking = {};

var conditionDelegateInjector = require('inject-loader!../newReturningVisitor');

var conditionDelegate = conditionDelegateInjector({
  '../helpers/visitorTracking': mockVisitorTracking
});

var getSettings = function (isNewVisitor) {
  return {
    isNewVisitor: isNewVisitor
  };
};

describe('new vs. returning condition delegate', function () {
  it('returns true when isNewVisitor = true and the visitor is new', function () {
    mockVisitorTracking.getIsNewVisitor = function () {
      return true;
    };

    var settings = getSettings(true);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns true when isNewVisitor = false and the visitor is returning', function () {
    mockVisitorTracking.getIsNewVisitor = function () {
      return false;
    };

    var settings = getSettings(false);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when isNewVisitor = false and the visitor is new', function () {
    mockVisitorTracking.getIsNewVisitor = function () {
      return true;
    };

    var settings = getSettings(false);
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns false when isNewVisitor = true and the visitor is returning', function () {
    mockVisitorTracking.getIsNewVisitor = function () {
      return false;
    };

    var settings = getSettings(true);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
