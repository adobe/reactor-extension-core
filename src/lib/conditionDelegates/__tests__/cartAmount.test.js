'use strict';

var conditionDelegateInjector = require('inject!../cartAmount');
var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();

var getSettings = function(dataElement, operator, amount) {
  return {
    dataElement: dataElement,
    operator: operator,
    amount: amount
  };
};

describe('cart amount condition delegate', function() {
  describe('with numerical data element value', function() {
    var conditionDelegate;
    beforeAll(function() {
      conditionDelegate = conditionDelegateInjector({
        getVar: function() {
          return 5.17;
        },
        getExtension: publicRequire('getExtension')
      });
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
      var conditionDelegate;
      beforeAll(function() {
        conditionDelegate = conditionDelegateInjector({
          getVar: function() {
            return nonNumber.dataElementValue;
          },
          getExtension: publicRequire('getExtension')
        });
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
