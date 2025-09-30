/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

var javascriptToolsDelegate = require('../javascriptTools');

describe('javascript tools data element delegate', function () {
  describe('when the operator is simpleReplace', function () {
    it('replaces the searched value', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 'source',
          operator: 'simpleReplace',
          searchValue: 'our',
          replacementValue: 'a'
        })
      ).toBe('sace');
    });

    it('replaces all the findings of the searched value', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 'souroure',
          replaceAll: true,
          operator: 'simpleReplace',
          searchValue: 'our',
          replacementValue: 'a'
        })
      ).toBe('saae');
    });

    it('replaces the search value if the source is a number', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 555,
          operator: 'simpleReplace',
          searchValue: '5',
          replacementValue: 'a'
        })
      ).toBe('a55');
    });

    it('returns the original value if it is not a string or number', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: null,
          operator: 'simpleReplace',
          searchValue: '5',
          replacementValue: 'a'
        })
      ).toBe(null);
    });
  });

  describe('when the operator is regexReplace', function () {
    it('replaces the regex input', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 'soooorce',
          operator: 'regexReplace',
          regexInput: 'o{2}',
          replacementValue: 'a'
        })
      ).toBe('saoorce');
    });

    it('replaces the regex input when caseInsensitive flag is set', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 'soOOOoorce',
          operator: 'regexReplace',
          caseInsensitive: true,
          regexInput: 'o{2}',
          replacementValue: 'a'
        })
      ).toBe('saOOoorce');
    });

    it('replaces all the findings of the regex input', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 'soooorce',
          operator: 'regexReplace',
          regexInput: 'o{2}',
          replaceAll: true,
          replacementValue: 'a'
        })
      ).toBe('saarce');
    });

    it('replaces the regex input if the source is a number', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 5555,
          operator: 'regexReplace',
          regexInput: '5{2}',
          replacementValue: 'a'
        })
      ).toBe('a55');
    });

    it('returns the original value if it is not a string or number', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: null,
          operator: 'regexReplace',
          regexInput: '5{2}',
          replacementValue: 'a'
        })
      ).toBe(null);
    });
  });

  describe('when the operator is substring', function () {
    it('returns the part between the start index and the end index', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 'abcdefghij',
          operator: 'substring',
          start: 3,
          end: 6
        })
      ).toBe('def');
    });

    it('returns the part between the start index and the end of the string', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 'abcdefghij',
          operator: 'substring',
          start: 3
        })
      ).toBe('defghij');
    });

    it(
      'returns the part between the start index and the end index when the' +
        ' value is a number',
      function () {
        expect(
          javascriptToolsDelegate({
            sourceValue: 12345678,
            operator: 'substring',
            start: 3,
            end: 6
          })
        ).toBe('456');
      }
    );

    it('returns the original value if it is not a string or number', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: null,
          operator: 'substring',
          start: 3,
          end: 6
        })
      ).toBe(null);
    });
  });

  describe('when the operator is regexMatch', function () {
    it('returns the matched regex', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 'soooorce',
          operator: 'regexMatch',
          regexInput: 'o{2}'
        })
      ).toBe('oo');
    });

    it('returns the matched regex when caseInsensitive flag is set', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 'soOOoorce',
          operator: 'regexMatch',
          caseInsensitive: true,
          regexInput: 'o{2}'
        })
      ).toBe('oO');
    });

    it('replaces the regex input if the source is a number', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 5555,
          operator: 'regexMatch',
          regexInput: '5{2}'
        })
      ).toBe('55');
    });

    it('returns the original value if it is not a string or number', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: null,
          operator: 'regexMatch',
          regexInput: '5{2}'
        })
      ).toBe(null);
    });
  });

  describe('when the operator is length', function () {
    it('returns the length of a string', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 'soooorce',
          operator: 'length'
        })
      ).toBe(8);
    });

    it('returns the length of an array', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: ['a', 'b', 'c'],
          operator: 'length'
        })
      ).toBe(3);
    });

    it('returns the length of other types', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 5555,
          operator: 'length'
        })
      ).toBe(0);
    });

    describe('when the operator is slice', function () {
      describe('and the source value is string', function () {
        it('returns the part between the start index and the end index', function () {
          expect(
            javascriptToolsDelegate({
              sourceValue: 'abcdefghij',
              operator: 'slice',
              start: 3,
              end: 6
            })
          ).toBe('def');
        });

        it('returns the part between the start index and the end of the value', function () {
          expect(
            javascriptToolsDelegate({
              sourceValue: 'abcdefghij',
              operator: 'slice',
              start: 3
            })
          ).toBe('defghij');
        });
      });

      describe('and the source value is array', function () {
        it('returns the part between the start index and the end index', function () {
          expect(
            javascriptToolsDelegate({
              sourceValue: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              operator: 'slice',
              start: 3,
              end: 6
            })
          ).toEqual([3, 4, 5]);
        });

        it('returns the part between the start index and the end of the value', function () {
          expect(
            javascriptToolsDelegate({
              sourceValue: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              operator: 'slice',
              start: 3
            })
          ).toEqual([3, 4, 5, 6, 7, 8]);
        });
      });

      describe('and the source value is a number', function () {
        it('returns the part between the start index and the end index', function () {
          expect(
            javascriptToolsDelegate({
              sourceValue: 12345678,
              operator: 'slice',
              start: 3,
              end: 6
            })
          ).toBe('456');
        });

        it('returns the part between the start index and the end of the value', function () {
          expect(
            javascriptToolsDelegate({
              sourceValue: 12345678,
              operator: 'slice',
              start: 3
            })
          ).toBe('45678');
        });
      });

      it('returns the original value if it is not a string or number', function () {
        expect(
          javascriptToolsDelegate({
            sourceValue: null,
            operator: 'slice',
            start: 3
          })
        ).toBe(null);
      });
    });

    describe('when operator is indexOf', function () {
      it('returns the first index of the searched value', function () {
        expect(
          javascriptToolsDelegate({
            sourceValue: 'abcdefghij',
            operator: 'indexOf',
            searchValue: 'c'
          })
        ).toBe(2);
      });

      it('returns the first index of the searched value when it is a number', function () {
        expect(
          javascriptToolsDelegate({
            sourceValue: 12345678,
            operator: 'indexOf',
            searchValue: 3
          })
        ).toBe(2);
      });

      it('returns the original value if it is not a string or number', function () {
        expect(
          javascriptToolsDelegate({
            sourceValue: null,
            operator: 'indexOf',
            searchValue: 3
          })
        ).toBe(null);
      });
    });

    describe('when operator is lastIndexOf', function () {
      it('returns the last index of the searched value', function () {
        expect(
          javascriptToolsDelegate({
            sourceValue: 'abcdefghicj',
            operator: 'lastIndexOf',
            searchValue: 'c'
          })
        ).toBe(9);
      });

      it('returns the last index of the searched value when it is a number', function () {
        expect(
          javascriptToolsDelegate({
            sourceValue: 123456738,
            operator: 'lastIndexOf',
            searchValue: 3
          })
        ).toBe(7);
      });

      it('returns the original value if it is not a string or number', function () {
        expect(
          javascriptToolsDelegate({
            sourceValue: null,
            operator: 'lastIndexOf',
            searchValue: 3
          })
        ).toBe(null);
      });
    });

    describe('when operator is join', function () {
      it('returns a string of joined elements', function () {
        expect(
          javascriptToolsDelegate({
            sourceValue: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            operator: 'join',
            delimiter: ':'
          })
        ).toBe('0:1:2:3:4:5:6:7:8');
      });

      it('returns the identity value when source value is not an array', function () {
        expect(
          javascriptToolsDelegate({
            sourceValue: 123456738,
            operator: 'join',
            delimiter: ':'
          })
        ).toBe(123456738);
      });
    });
  });

  describe('when operator is split', function () {
    it('returns the array of split elements', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 'a:b:c:d:e',
          operator: 'split',
          delimiter: ':'
        })
      ).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    it('returns the array of split elements for non string source value', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 12345678,
          operator: 'split',
          delimiter: ''
        })
      ).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
    });

    it('returns the original value if it is not a string or number', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: null,
          operator: 'split',
          delimiter: ''
        })
      ).toBe(null);
    });
  });

  describe('when operator is arrayPop', function () {
    it('returns the last element of the array', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          operator: 'arrayPop'
        })
      ).toBe(8);
    });

    it('returns the identity value when source value is not an array', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 123456738,
          operator: 'arrayPop'
        })
      ).toBe(123456738);
    });
  });

  describe('when operator is arrayShift', function () {
    it('returns the first element of the array', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          operator: 'arrayShift'
        })
      ).toBe(0);
    });

    it('returns the identity value when source value is not an array', function () {
      expect(
        javascriptToolsDelegate({
          sourceValue: 123456738,
          operator: 'arrayShift'
        })
      ).toBe(123456738);
    });
  });
});
