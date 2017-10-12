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

var conditionDelegate = require('../cartItemQuantity');

var getSettings = function(dataElement, operator, quantity) {
  return {
    dataElement: dataElement,
    operator: operator,
    quantity: quantity
  };
};

describe('cart item quantity condition delegate', function() {
  describe('with numerical data element value', function() {
    beforeAll(function() {
      mockTurbineVariable({
        getDataElementValue: function() {
          return 5;
        }
      });
    });

    afterAll(function() {
      resetTurbineVariable();
    });

    it('returns true when item quantity is above "greater than" constraint', function() {
      var settings = getSettings('foo', '>', 4);
      expect(conditionDelegate(settings)).toBe(true);
    });

    it('returns false when item quantity is below "greater than" constraint', function() {
      var settings = getSettings('foo', '>', 6);
      expect(conditionDelegate(settings)).toBe(false);
    });

    it('returns true when item quantity is below "less than" constraint', function() {
      var settings = getSettings('foo', '<', 6);
      expect(conditionDelegate(settings)).toBe(true);
    });

    it('returns false when item quantity is above "less than" constraint', function() {
      var settings = getSettings('foo', '<', 5);
      expect(conditionDelegate(settings)).toBe(false);
    });

    it('returns true when item quantity matches "equals" constraint', function() {
      var settings = getSettings('foo', '=', 5);
      expect(conditionDelegate(settings)).toBe(true);
    });

    it('returns false when item quantity does not match "equals" constraint', function() {
      var settings = getSettings('foo', '=', 11);
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
      dataElementValue: '4',
      coercedValue: 4
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
        var settings = getSettings('foo', '>', nonNumber.coercedValue - 1);
        expect(conditionDelegate(settings)).toBe(true);

        settings = getSettings('foo', '>', nonNumber.coercedValue + 1);
        expect(conditionDelegate(settings)).toBe(false);

        settings = getSettings('foo', '<', nonNumber.coercedValue + 1);
        expect(conditionDelegate(settings)).toBe(true);

        settings = getSettings('foo', '<', nonNumber.coercedValue - 1);
        expect(conditionDelegate(settings)).toBe(false);

        settings = getSettings('foo', '=', nonNumber.coercedValue);
        expect(conditionDelegate(settings)).toBe(true);

        settings = getSettings('foo', '=', nonNumber.coercedValue - 11);
        expect(conditionDelegate(settings)).toBe(false);
      });
    });
  });
});
