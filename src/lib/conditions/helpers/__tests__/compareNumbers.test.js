/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
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

var compareNumbers = require('../compareNumbers');

describe('compare numbers', function () {
  describe('with "greater than" constraint', function () {
    it('returns true if num1 is greater than num2', function () {
      expect(compareNumbers(6, '>', 5)).toBe(true);
    });

    it('returns false if num1 is less than num2', function () {
      expect(compareNumbers(4, '>', 5)).toBe(false);
    });

    it('returns false if num1 is equal to num2', function () {
      expect(compareNumbers(5, '>', 5)).toBe(false);
    });
  });

  describe('with "less than" constraint', function () {
    it('returns true if num1 is less than num2', function () {
      expect(compareNumbers(4, '<', 5)).toBe(true);
    });

    it('returns false if num1 is greater than num2', function () {
      expect(compareNumbers(6, '<', 5)).toBe(false);
    });

    it('returns false if num1 is equal to num2', function () {
      expect(compareNumbers(5, '<', 5)).toBe(false);
    });
  });

  describe('with "equal to" constraint', function () {
    it('returns true if num1 equals num2', function () {
      expect(compareNumbers(5, '=', 5)).toBe(true);
    });

    it('returns false if num1 is greater than num2', function () {
      expect(compareNumbers(6, '=', 5)).toBe(false);
    });

    it('returns false if num1 is less than num2', function () {
      expect(compareNumbers(4, '=', 5)).toBe(false);
    });
  });
});
