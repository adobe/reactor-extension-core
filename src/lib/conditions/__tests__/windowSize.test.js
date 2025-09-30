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

var mockDocument = {
  documentElement: {
    clientWidth: 1366,
    clientHeight: 768
  }
};

var conditionDelegateInjector = require('inject-loader!../windowSize');
var conditionDelegate = conditionDelegateInjector({
  '@adobe/reactor-document': mockDocument
});

var getSettings = function (width, widthOperator, height, heightOperator) {
  return {
    width: width,
    widthOperator: widthOperator,
    height: height,
    heightOperator: heightOperator
  };
};

describe('window size condition delegate', function () {
  it('returns true when dimension is above "greater than" constraint', function () {
    var settings = getSettings(1365, '>', 768, '=');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when dimension is below "greater than" constraint', function () {
    var settings = getSettings(1366, '>', 768, '=');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when dimension is below "less than" constraint', function () {
    var settings = getSettings(1366, '=', 769, '<');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when dimension is above "less than" constraint', function () {
    var settings = getSettings(1366, '=', 768, '<');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when dimension matches "equals" constraint', function () {
    var settings = getSettings(1366, '=', 768, '=');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when dimension does not match "equals" constraint', function () {
    var settings = getSettings(1366, '=', 767, '=');
    expect(conditionDelegate(settings)).toBe(false);
  });
});
