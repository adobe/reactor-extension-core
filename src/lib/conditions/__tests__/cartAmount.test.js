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

var conditionDelegate = require('../cartAmount');

var getSettings = function(dataElement, operator, amount) {
  return {
    dataElement: dataElement,
    operator: operator,
    amount: amount
  };
};

describe('cart amount condition delegate', function() {
  describe('with numerical data element value', function() {
    beforeAll(function() {
      mockTurbineVariable({
        getDataElementValue: function() {
          return 5.17;
        }
      });
    });

    afterAll(function() {
      resetTurbineVariable();
    });

    it('returns true when cart amount is above "greater than" constraint', function() {
      var settings = getSettings('foo', '>', 5.16);
      expect(conditionDelegate(settings)).toBe(true);
    });

    it('returns false when cart amount is below "greater than" constraint', function() {
      var settings = getSettings('foo', '>', 5.18);
      expect(conditionDelegate(settings)).toBe(false);
    });

    it('returns true when cart amount is below "less than" constraint', function() {
      var settings = getSettings('foo', '<', 5.18);
      expect(conditionDelegate(settings)).toBe(true);
    });

    it('returns false when cart amount is above "less than" constraint', function() {
      var settings = getSettings('foo', '<', 5.16);
      expect(conditionDelegate(settings)).toBe(false);
    });

    it('returns true when cart amount matches "equals" constraint', function() {
      var settings = getSettings('foo', '=', 5.17);
      expect(conditionDelegate(settings)).toBe(true);
    });

    it('returns false when cart amount does not match "equals" constraint', function() {
      var settings = getSettings('foo', '=', 11.42);
      expect(conditionDelegate(settings)).toBe(false);
    });
  });

  var nonNumbers = [
    {
      dataElementValue: undefined,
      coercedValue: 0
    },
    {
      dataElementValue: null,
      coercedValue: 0
    },
    {
      dataElementValue: 'niner',
      coercedValue: 0
    },
    {
      dataElementValue: '',
      coercedValue: 0
    },
    {
      dataElementValue: '4.82',
      coercedValue: 4.82
    }
  ];

  nonNumbers.forEach(function(nonNumber) {
    describe('with non-numerical data element value of ' + nonNumber.dataElementValue, function() {
      beforeAll(function() {
        mockTurbineVariable({
          getDataElementValue: function() {
            return nonNumber.dataElementValue;
          }
        });
      });

      afterAll(function() {
        resetTurbineVariable();
      });

      it('coerces the value to ' + nonNumber.coercedValue, function() {
        var settings = getSettings('foo', '>', nonNumber.coercedValue - .01);
        expect(conditionDelegate(settings)).toBe(true);

        settings = getSettings('foo', '>', nonNumber.coercedValue + .01);
        expect(conditionDelegate(settings)).toBe(false);

        settings = getSettings('foo', '<', nonNumber.coercedValue + .01);
        expect(conditionDelegate(settings)).toBe(true);

        settings = getSettings('foo', '<', nonNumber.coercedValue - .01);
        expect(conditionDelegate(settings)).toBe(false);

        settings = getSettings('foo', '=', nonNumber.coercedValue);
        expect(conditionDelegate(settings)).toBe(true);

        settings = getSettings('foo', '=', nonNumber.coercedValue - 11);
        expect(conditionDelegate(settings)).toBe(false);
      });
    });
  });
});
