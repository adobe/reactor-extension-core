'use strict';

var compareNumbers = require('../compareNumbers');

describe('compare numbers', function() {
  describe('with "greater than" constraint', function() {
    it('returns true if num1 is greater than num2', function() {
      expect(compareNumbers(6, '>', 5)).toBe(true);
    });

    it('returns false if num1 is less than num2', function() {
      expect(compareNumbers(4, '>', 5)).toBe(false);
    });

    it('returns false if num1 is equal to num2', function() {
      expect(compareNumbers(5, '>', 5)).toBe(false);
    });
  });

  describe('with "less than" constraint', function() {
    it('returns true if num1 is less than num2', function() {
      expect(compareNumbers(4, '<', 5)).toBe(true);
    });

    it('returns false if num1 is greater than num2', function() {
      expect(compareNumbers(6, '<', 5)).toBe(false);
    });

    it('returns false if num1 is equal to num2', function() {
      expect(compareNumbers(5, '<', 5)).toBe(false);
    });
  });

  describe('with "equal to" constraint', function() {
    it('returns true if num1 equals num2', function() {
      expect(compareNumbers(5, '=', 5)).toBe(true);
    });

    it('returns false if num1 is greater than num2', function() {
      expect(compareNumbers(6, '=', 5)).toBe(false);
    });

    it('returns false if num1 is less than num2', function() {
      expect(compareNumbers(4, '=', 5)).toBe(false);
    });
  });
});
