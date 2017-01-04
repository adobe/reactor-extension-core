'use strict';

var conditionDelegateInjector = require('inject!../cartItemQuantity');

var getSettings = function(dataElement, operator, quantity) {
  return {
    dataElement: dataElement,
    operator: operator,
    quantity: quantity
  };
};

describe('cart item quantity condition delegate', function() {
  describe('with numerical data element value', function() {
    var conditionDelegate;

    beforeAll(function() {
      conditionDelegate = conditionDelegateInjector({
        '@turbine/get-data-element-value': function() {
          return 5;
        }
      });
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
      var conditionDelegate;

      beforeAll(function() {
        conditionDelegate = conditionDelegateInjector({
          '@turbine/get-data-element-value': function() {
            return nonNumber.dataElementValue;
          }
        });
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
