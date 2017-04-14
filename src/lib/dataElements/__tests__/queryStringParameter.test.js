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

var getQueryParamSpy = jasmine.createSpy().and.returnValue('bar');
var dataElementDelegate = require('inject!../queryStringParameter')({
  '@turbine/get-query-param': getQueryParamSpy
});

describe('query string parameter data element delegate', function() {
  it('should return a query parameter value', function() {
    var settings = {
      name: 'foo',
      caseInsensitive: true
    };

    var value = dataElementDelegate(settings);

    expect(value).toBe('bar');
    expect(getQueryParamSpy.calls.argsFor(0)).toEqual(['foo', true]);
  });
});
