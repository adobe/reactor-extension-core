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

var mockClientInfo = {
  browser: 'Foo'
};

var conditionDelegateInjector = require('inject!../browser');
var conditionDelegate = conditionDelegateInjector({
  './helpers/clientInfo': mockClientInfo
});

var getSettings = function(browsers) {
  return {
    browsers: browsers
  };
};

describe('browser condition delegate', function() {
  it('returns true when the current browser matches one of the selected browsers', function() {
    var settings = getSettings(['Shoe', 'Goo', 'Foo', 'Moo']);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the current browser does not match any of the ' +
      'selected browsers', function() {
    var settings = getSettings(['Shoe', 'Goo', 'Boo', 'Moo']);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
