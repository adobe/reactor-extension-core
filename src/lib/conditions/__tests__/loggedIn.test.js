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

var conditionDelegate = require('../loggedIn');

describe('logged in condition delegate', function() {
  var dataElementValue;
  var mockTurbine;

  beforeAll(function() {
    mockTurbine = {
      getDataElementValue: jasmine.createSpy().and.callFake(function() {
        return dataElementValue;
      })
    };

    mockTurbineVariable(mockTurbine);
  });

  afterAll(function() {
    resetTurbineVariable();
  });

  it('returns the data element value', function() {
    var settings = {
      dataElement: 'foo'
    };

    dataElementValue = true;
    expect(conditionDelegate(settings)).toBe(true);

    dataElementValue = false;
    expect(conditionDelegate(settings)).toBe(false);

    dataElementValue = undefined;
    expect(conditionDelegate(settings)).toBe(false);

    expect(mockTurbine.getDataElementValue).toHaveBeenCalledWith('foo');
  });
});
