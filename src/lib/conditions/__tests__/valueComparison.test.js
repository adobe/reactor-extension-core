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

import conditionDelegate from '../valueComparison.js';

const truthyValues = [
  true,
  {},
  [],
  42,
  'foo',
  new Date(),
  -42,
  3.14,
  -3.14,
  Infinity,
  -Infinity
];

const falsyValues = [false, null, undefined, 0, NaN, ''];

describe('value comparison delegate', function () {
  describe('equals operator', function () {
    it('returns true on string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'equals'
          },
          rightOperand: 'abc'
        })
      ).toBe(true);
    });

    it('returns false on case mismatch', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'equals'
          },
          rightOperand: 'Abc'
        })
      ).toBe(false);
    });

    it('returns true on case mismatch with case insensitivity enabled', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'equals',
            caseInsensitive: true
          },
          rightOperand: 'Abc'
        })
      ).toBe(true);
    });

    it('returns true on string+number match', function () {
      expect(
        conditionDelegate({
          leftOperand: '123',
          comparison: {
            operator: 'equals'
          },
          rightOperand: 123
        })
      ).toBe(true);
    });

    it('returns true on string+number match', function () {
      expect(
        conditionDelegate({
          leftOperand: '123',
          comparison: {
            operator: 'equals'
          },
          rightOperand: 123
        })
      ).toBe(true);
    });

    it('returns true on object match', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'equals'
          },
          rightOperand: obj
        })
      ).toBe(true);
    });

    it('returns true on boolean match', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'equals'
          },
          rightOperand: true
        })
      ).toBe(true);
    });

    it('returns false on string+boolean match', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'equals'
          },
          rightOperand: 'true'
        })
      ).toBe(false);
    });
  });

  describe('doesNotEqual operator', function () {
    it('returns false on string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotEqual'
          },
          rightOperand: 'abc'
        })
      ).toBe(false);
    });

    it('returns true on case mismatch', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotEqual'
          },
          rightOperand: 'Abc'
        })
      ).toBe(true);
    });

    it('returns false on case mismatch with case insensitivity enabled', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotEqual',
            caseInsensitive: true
          },
          rightOperand: 'Abc'
        })
      ).toBe(false);
    });

    it('returns false on string+number match', function () {
      expect(
        conditionDelegate({
          leftOperand: '123',
          comparison: {
            operator: 'doesNotEqual'
          },
          rightOperand: 123
        })
      ).toBe(false);
    });

    it('returns false on string+number match', function () {
      expect(
        conditionDelegate({
          leftOperand: '123',
          comparison: {
            operator: 'doesNotEqual'
          },
          rightOperand: 123
        })
      ).toBe(false);
    });

    it('returns false on object match', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'doesNotEqual'
          },
          rightOperand: obj
        })
      ).toBe(false);
    });

    it('returns false on boolean match', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'doesNotEqual'
          },
          rightOperand: true
        })
      ).toBe(false);
    });

    it('returns true on string+boolean match', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'doesNotEqual'
          },
          rightOperand: 'true'
        })
      ).toBe(true);
    });
  });

  describe('contains operator', function () {
    it('returns true on string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'contains'
          },
          rightOperand: 'b'
        })
      ).toBe(true);
    });

    it('returns false on string mismatch', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'contains'
          },
          rightOperand: 'd'
        })
      ).toBe(false);
    });

    it('returns true on case mismatch with case insensitivity enabled', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'contains',
            caseInsensitive: true
          },
          rightOperand: 'B'
        })
      ).toBe(true);
    });

    it('returns true on string+number match', function () {
      expect(
        conditionDelegate({
          leftOperand: '123',
          comparison: {
            operator: 'contains'
          },
          rightOperand: 2
        })
      ).toBe(true);
    });

    it('returns true on number+string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 123,
          comparison: {
            operator: 'contains'
          },
          rightOperand: '2'
        })
      ).toBe(true);
    });

    it('returns false on object match', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'contains'
          },
          rightOperand: obj
        })
      ).toBe(false);
    });

    it('returns false on boolean match', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'contains'
          },
          rightOperand: true
        })
      ).toBe(false);
    });

    it('returns false on null match', function () {
      expect(
        conditionDelegate({
          leftOperand: null,
          comparison: {
            operator: 'contains'
          },
          rightOperand: null
        })
      ).toBe(false);
    });
  });

  describe('doesNotContain operator', function () {
    it('returns false on string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotContain'
          },
          rightOperand: 'b'
        })
      ).toBe(false);
    });

    it('returns true on string mismatch', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotContain'
          },
          rightOperand: 'd'
        })
      ).toBe(true);
    });

    it('returns false on case mismatch with case insensitivity enabled', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotContain',
            caseInsensitive: true
          },
          rightOperand: 'B'
        })
      ).toBe(false);
    });

    it('returns false on string+number match', function () {
      expect(
        conditionDelegate({
          leftOperand: '123',
          comparison: {
            operator: 'doesNotContain'
          },
          rightOperand: 2
        })
      ).toBe(false);
    });

    it('returns false on number+string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 123,
          comparison: {
            operator: 'doesNotContain'
          },
          rightOperand: '2'
        })
      ).toBe(false);
    });

    it('returns true on object match', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'doesNotContain'
          },
          rightOperand: obj
        })
      ).toBe(true);
    });

    it('returns true on boolean match', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'doesNotContain'
          },
          rightOperand: true
        })
      ).toBe(true);
    });

    it('returns true on null match', function () {
      expect(
        conditionDelegate({
          leftOperand: null,
          comparison: {
            operator: 'doesNotContain'
          },
          rightOperand: null
        })
      ).toBe(true);
    });
  });

  describe('startsWith operator', function () {
    it('returns true on string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'startsWith'
          },
          rightOperand: 'a'
        })
      ).toBe(true);
    });

    it('returns false on string mismatch', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'startsWith'
          },
          rightOperand: 'b'
        })
      ).toBe(false);
    });

    it('returns true on case mismatch with case insensitivity enabled', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'startsWith',
            caseInsensitive: true
          },
          rightOperand: 'A'
        })
      ).toBe(true);
    });

    it('returns true on string+number match', function () {
      expect(
        conditionDelegate({
          leftOperand: '123',
          comparison: {
            operator: 'startsWith'
          },
          rightOperand: 1
        })
      ).toBe(true);
    });

    it('returns true on number+string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 123,
          comparison: {
            operator: 'startsWith'
          },
          rightOperand: '1'
        })
      ).toBe(true);
    });

    it('returns false on object match', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'startsWith'
          },
          rightOperand: obj
        })
      ).toBe(false);
    });

    it('returns false on boolean match', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'startsWith'
          },
          rightOperand: true
        })
      ).toBe(false);
    });

    it('returns false on null match', function () {
      expect(
        conditionDelegate({
          leftOperand: null,
          comparison: {
            operator: 'startsWith'
          },
          rightOperand: null
        })
      ).toBe(false);
    });
  });

  describe('doesNotStartWith operator', function () {
    it('returns false on string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotStartWith'
          },
          rightOperand: 'a'
        })
      ).toBe(false);
    });

    it('returns true on string mismatch', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotStartWith'
          },
          rightOperand: 'b'
        })
      ).toBe(true);
    });

    it('returns false on case mismatch with case insensitivity enabled', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotStartWith',
            caseInsensitive: true
          },
          rightOperand: 'A'
        })
      ).toBe(false);
    });

    it('returns false on string+number match', function () {
      expect(
        conditionDelegate({
          leftOperand: '123',
          comparison: {
            operator: 'doesNotStartWith'
          },
          rightOperand: 1
        })
      ).toBe(false);
    });

    it('returns false on number+string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 123,
          comparison: {
            operator: 'doesNotStartWith'
          },
          rightOperand: '1'
        })
      ).toBe(false);
    });

    it('returns true on object match', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'doesNotStartWith'
          },
          rightOperand: obj
        })
      ).toBe(true);
    });

    it('returns true on boolean match', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'doesNotStartWith'
          },
          rightOperand: true
        })
      ).toBe(true);
    });

    it('returns true on null match', function () {
      expect(
        conditionDelegate({
          leftOperand: null,
          comparison: {
            operator: 'doesNotStartWith'
          },
          rightOperand: null
        })
      ).toBe(true);
    });
  });

  describe('endsWith operator', function () {
    it('returns true on string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'endsWith'
          },
          rightOperand: 'c'
        })
      ).toBe(true);
    });

    it('returns false on string mismatch', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'endsWith'
          },
          rightOperand: 'b'
        })
      ).toBe(false);
    });

    it('returns true on case mismatch with case insensitivity enabled', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'endsWith',
            caseInsensitive: true
          },
          rightOperand: 'C'
        })
      ).toBe(true);
    });

    it('returns true on string+number match', function () {
      expect(
        conditionDelegate({
          leftOperand: '123',
          comparison: {
            operator: 'endsWith'
          },
          rightOperand: 3
        })
      ).toBe(true);
    });

    it('returns true on number+string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 123,
          comparison: {
            operator: 'endsWith'
          },
          rightOperand: '3'
        })
      ).toBe(true);
    });

    it('returns false on object comparison', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'endsWith'
          },
          rightOperand: obj
        })
      ).toBe(false);
    });

    it('returns false on boolean comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'endsWith'
          },
          rightOperand: true
        })
      ).toBe(false);
    });

    it('returns false on null comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: null,
          comparison: {
            operator: 'endsWith'
          },
          rightOperand: null
        })
      ).toBe(false);
    });
  });

  describe('doesNotEndWith operator', function () {
    it('returns false on string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotEndWith'
          },
          rightOperand: 'c'
        })
      ).toBe(false);
    });

    it('returns true on string mismatch', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotEndWith'
          },
          rightOperand: 'b'
        })
      ).toBe(true);
    });

    it('returns false on case mismatch with case insensitivity enabled', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotEndWith',
            caseInsensitive: true
          },
          rightOperand: 'C'
        })
      ).toBe(false);
    });

    it('returns false on string+number match', function () {
      expect(
        conditionDelegate({
          leftOperand: '123',
          comparison: {
            operator: 'doesNotEndWith'
          },
          rightOperand: 3
        })
      ).toBe(false);
    });

    it('returns false on number+string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 123,
          comparison: {
            operator: 'doesNotEndWith'
          },
          rightOperand: '3'
        })
      ).toBe(false);
    });

    it('returns true on object comparison', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'doesNotEndWith'
          },
          rightOperand: obj
        })
      ).toBe(true);
    });

    it('returns true on boolean comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'doesNotEndWith'
          },
          rightOperand: true
        })
      ).toBe(true);
    });

    it('returns true on null comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: null,
          comparison: {
            operator: 'doesNotEndWith'
          },
          rightOperand: null
        })
      ).toBe(true);
    });
  });

  describe('matchesRegex operator', function () {
    it('returns true on string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'matchesRegex'
          },
          rightOperand: 'a\\Sc'
        })
      ).toBe(true);
    });

    it('returns false on string mismatch', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'matchesRegex'
          },
          rightOperand: 'a\\Sd'
        })
      ).toBe(false);
    });

    it('returns true on case mismatch with case insensitivity enabled', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'matchesRegex',
            caseInsensitive: true
          },
          // DTM-13120 Also tests that the regex pattern doesn't get lowercased
          rightOperand: 'a\\SC'
        })
      ).toBe(true);
    });

    it('returns true on string+number match', function () {
      expect(
        conditionDelegate({
          leftOperand: '3',
          comparison: {
            operator: 'matchesRegex'
          },
          rightOperand: 3
        })
      ).toBe(true);
    });

    it('returns true on number+string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 3,
          comparison: {
            operator: 'matchesRegex'
          },
          rightOperand: '3'
        })
      ).toBe(true);
    });

    it('returns false on object comparison', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'matchesRegex'
          },
          rightOperand: obj
        })
      ).toBe(false);
    });

    it('returns false on boolean comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'matchesRegex'
          },
          rightOperand: true
        })
      ).toBe(false);
    });

    it('returns false on null comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: null,
          comparison: {
            operator: 'matchesRegex'
          },
          rightOperand: null
        })
      ).toBe(false);
    });
  });

  describe('doesNotMatchRegex operator', function () {
    it('returns false on string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotMatchRegex'
          },
          rightOperand: 'a\\Sc'
        })
      ).toBe(false);
    });

    it('returns true on string mismatch', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotMatchRegex'
          },
          rightOperand: 'a\\SD'
        })
      ).toBe(true);
    });

    it('returns false on case mismatch with case insensitivity enabled', function () {
      expect(
        conditionDelegate({
          leftOperand: 'abc',
          comparison: {
            operator: 'doesNotMatchRegex',
            caseInsensitive: true
          },
          // DTM-13120 Also tests that the regex pattern doesn't get lowercased
          rightOperand: 'a\\SC'
        })
      ).toBe(false);
    });

    it('returns false on string+number match', function () {
      expect(
        conditionDelegate({
          leftOperand: '3',
          comparison: {
            operator: 'doesNotMatchRegex'
          },
          rightOperand: 3
        })
      ).toBe(false);
    });

    it('returns false on number+string match', function () {
      expect(
        conditionDelegate({
          leftOperand: 3,
          comparison: {
            operator: 'doesNotMatchRegex'
          },
          rightOperand: '3'
        })
      ).toBe(false);
    });

    it('returns true on object comparison', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'doesNotMatchRegex'
          },
          rightOperand: obj
        })
      ).toBe(true);
    });

    it('returns true on boolean comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'doesNotMatchRegex'
          },
          rightOperand: true
        })
      ).toBe(true);
    });

    it('returns true on null comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: null,
          comparison: {
            operator: 'doesNotMatchRegex'
          },
          rightOperand: null
        })
      ).toBe(true);
    });
  });

  describe('lessThan operator', function () {
    it('returns true when left less than right', function () {
      expect(
        conditionDelegate({
          leftOperand: 1,
          comparison: {
            operator: 'lessThan'
          },
          rightOperand: 2
        })
      ).toBe(true);
    });

    it('returns false when left not less than right', function () {
      expect(
        conditionDelegate({
          leftOperand: 1,
          comparison: {
            operator: 'lessThan'
          },
          rightOperand: 1
        })
      ).toBe(false);
    });

    it('returns true when left less than right (strings)', function () {
      expect(
        conditionDelegate({
          leftOperand: '1',
          comparison: {
            operator: 'lessThan'
          },
          rightOperand: '2'
        })
      ).toBe(true);
    });

    it('returns false on object comparison', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'lessThan'
          },
          rightOperand: obj
        })
      ).toBe(false);
    });

    it('returns false on boolean comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'lessThan'
          },
          rightOperand: true
        })
      ).toBe(false);
    });

    it('returns false on null comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: null,
          comparison: {
            operator: 'lessThan'
          },
          rightOperand: null
        })
      ).toBe(false);
    });
  });

  describe('lessThanOrEqual operator', function () {
    it('returns true when left less right', function () {
      expect(
        conditionDelegate({
          leftOperand: 1,
          comparison: {
            operator: 'lessThanOrEqual'
          },
          rightOperand: 2
        })
      ).toBe(true);
    });

    it('returns true when left equal to right', function () {
      expect(
        conditionDelegate({
          leftOperand: 1,
          comparison: {
            operator: 'lessThanOrEqual'
          },
          rightOperand: 1
        })
      ).toBe(true);
    });

    it('returns false when left greater than right', function () {
      expect(
        conditionDelegate({
          leftOperand: 3,
          comparison: {
            operator: 'lessThanOrEqual'
          },
          rightOperand: 1
        })
      ).toBe(false);
    });

    it('returns true when left equal to right (strings)', function () {
      expect(
        conditionDelegate({
          leftOperand: '1',
          comparison: {
            operator: 'lessThanOrEqual'
          },
          rightOperand: '1'
        })
      ).toBe(true);
    });

    it('returns false on object comparison', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'lessThanOrEqual'
          },
          rightOperand: obj
        })
      ).toBe(false);
    });

    it('returns false on boolean comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'lessThanOrEqual'
          },
          rightOperand: true
        })
      ).toBe(false);
    });

    it('returns false on null comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: null,
          comparison: {
            operator: 'lessThanOrEqual'
          },
          rightOperand: null
        })
      ).toBe(false);
    });
  });

  describe('greaterThan operator', function () {
    it('returns true when left greater than right', function () {
      expect(
        conditionDelegate({
          leftOperand: 2,
          comparison: {
            operator: 'greaterThan'
          },
          rightOperand: 1
        })
      ).toBe(true);
    });

    it('returns false when left not greater than right', function () {
      expect(
        conditionDelegate({
          leftOperand: 1,
          comparison: {
            operator: 'greaterThan'
          },
          rightOperand: 1
        })
      ).toBe(false);
    });

    it('returns true when left greater than right (strings)', function () {
      expect(
        conditionDelegate({
          leftOperand: '2',
          comparison: {
            operator: 'greaterThan'
          },
          rightOperand: '1'
        })
      ).toBe(true);
    });

    it('returns false on object comparison', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'greaterThan'
          },
          rightOperand: obj
        })
      ).toBe(false);
    });

    it('returns false on boolean comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'greaterThan'
          },
          rightOperand: true
        })
      ).toBe(false);
    });

    it('returns false on null comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: null,
          comparison: {
            operator: 'greaterThan'
          },
          rightOperand: null
        })
      ).toBe(false);
    });
  });

  describe('greaterThanOrEqual operator', function () {
    it('returns true when left greater than right', function () {
      expect(
        conditionDelegate({
          leftOperand: 2,
          comparison: {
            operator: 'greaterThanOrEqual'
          },
          rightOperand: 1
        })
      ).toBe(true);
    });

    it('returns true when left equal to right', function () {
      expect(
        conditionDelegate({
          leftOperand: 1,
          comparison: {
            operator: 'greaterThanOrEqual'
          },
          rightOperand: 1
        })
      ).toBe(true);
    });

    it('returns false when left less than right', function () {
      expect(
        conditionDelegate({
          leftOperand: 1,
          comparison: {
            operator: 'greaterThanOrEqual'
          },
          rightOperand: 2
        })
      ).toBe(false);
    });

    it('returns true when left equal to right (strings)', function () {
      expect(
        conditionDelegate({
          leftOperand: '1',
          comparison: {
            operator: 'greaterThanOrEqual'
          },
          rightOperand: '1'
        })
      ).toBe(true);
    });

    it('returns false on object comparison', function () {
      var obj = {};
      expect(
        conditionDelegate({
          leftOperand: obj,
          comparison: {
            operator: 'greaterThanOrEqual'
          },
          rightOperand: obj
        })
      ).toBe(false);
    });

    it('returns false on boolean comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'greaterThanOrEqual'
          },
          rightOperand: true
        })
      ).toBe(false);
    });

    it('returns false on null comparison', function () {
      expect(
        conditionDelegate({
          leftOperand: null,
          comparison: {
            operator: 'greaterThanOrEqual'
          },
          rightOperand: null
        })
      ).toBe(false);
    });
  });

  describe('isTrue operator', function () {
    it('returns true when value is true', function () {
      expect(
        conditionDelegate({
          leftOperand: true,
          comparison: {
            operator: 'isTrue'
          }
        })
      ).toBe(true);
    });

    it('returns false when value is anything else', function () {
      expect(
        conditionDelegate({
          leftOperand: 'true',
          comparison: {
            operator: 'isTrue'
          }
        })
      ).toBe(false);
    });
  });

  describe('isTruthy operator', function () {
    truthyValues.forEach(function (value) {
      it('returns true for ' + value, function () {
        expect(
          conditionDelegate({
            leftOperand: value,
            comparison: {
              operator: 'isTruthy'
            }
          })
        ).toBe(true);
      });
    });

    falsyValues.forEach(function (value) {
      it('returns false for ' + value, function () {
        expect(
          conditionDelegate({
            leftOperand: value,
            comparison: {
              operator: 'isTruthy'
            }
          })
        ).toBe(false);
      });
    });
  });

  describe('isFalse operator', function () {
    it('returns true when value is false', function () {
      expect(
        conditionDelegate({
          leftOperand: false,
          comparison: {
            operator: 'isFalse'
          }
        })
      ).toBe(true);
    });

    it('returns false when value is anything else', function () {
      expect(
        conditionDelegate({
          leftOperand: 'false',
          comparison: {
            operator: 'isFalse'
          }
        })
      ).toBe(false);
    });
  });

  describe('isFalsy operator', function () {
    truthyValues.forEach(function (value) {
      it('returns false for ' + value, function () {
        expect(
          conditionDelegate({
            leftOperand: value,
            comparison: {
              operator: 'isFalsy'
            }
          })
        ).toBe(false);
      });
    });

    falsyValues.forEach(function (value) {
      it('returns true for ' + value, function () {
        expect(
          conditionDelegate({
            leftOperand: value,
            comparison: {
              operator: 'isFalsy'
            }
          })
        ).toBe(true);
      });
    });
  });
});
