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
  getLandingPage: function() {
    return 'http://landingpage.com/test.html';
  }
};

var conditionDelegateInjector = require('inject!../landingPage');
var conditionDelegate = conditionDelegateInjector({
  '../helpers/visitorTracking': mockVisitorTracking
});

var getSettings = function(page, pageIsRegex) {
  return {
    page: page,
    pageIsRegex: pageIsRegex
  };
};

describe('landing page condition delegate', function() {
  it('returns true when the landing page matches a string', function() {
    var settings = getSettings('http://landingpage.com/test.html', false);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the landing page does not match a string', function() {
    var settings = getSettings('http://foo.com/bar.html', false);
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the landing page matches a regex', function() {
    var settings = getSettings('Landingpage\\.com\\/t.st', true);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the landing page does not match a regex', function() {
    var settings = getSettings('f.o', true);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
