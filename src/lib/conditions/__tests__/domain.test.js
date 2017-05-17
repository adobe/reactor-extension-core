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

var mockDocument = {
  location: {
    hostname: 'www.example.com'
  }
};

var conditionDelegateInjector = require('inject!../domain');
var conditionDelegate = conditionDelegateInjector({
  '@turbine/document': mockDocument
});

var getSettings = function(domains) {
  return {
    domains: domains
  };
};

describe('domain condition delegate', function() {
  it('returns true when the domain matches', function() {
    var settings = getSettings(['adobe.com', 'Example.com']);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the domain does not match', function() {
    var settings = getSettings(['example..om', 'adobe.com']);
    expect(conditionDelegate(settings)).toBe(false);

    settings = getSettings(['adobe.com', 'www.example']);
    expect(conditionDelegate(settings)).toBe(false);

    settings = getSettings(['ample.com', 'adobe.com']);
    expect(conditionDelegate(settings)).toBe(false);

    settings = getSettings(['example.combo', 'adobe.com']);
    expect(conditionDelegate(settings)).toBe(false);

    settings = getSettings(['example.co', 'adobe.com']);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
