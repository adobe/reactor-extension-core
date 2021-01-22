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

var matcher = require('../textMatch');

describe('text-match', function () {
  it('returns true if string is an exact match', function () {
    expect(matcher('This is My House', 'This is My House')).toBe(true);
  });

  it('returns false if string is not an exact match', function () {
    expect(matcher('This is My House', 'This is NOT My House')).toBe(false);
  });

  it('returns true if the regex matches', function () {
    expect(matcher('This is NOT my House', /^T/)).toBe(true);
  });

  it('returns false if the regex does not match', function () {
    expect(matcher('This is NOT my House', /^Z/)).toBe(false);
  });

  it('returns false if the string is null', function () {
    expect(matcher(null, 'Something')).toBe(false);
  });

  it('Throws an Illegal Argument error message if the pattern is not defined', function () {
    var errorThrower = function () {
      matcher('This is My House');
    };
    expect(errorThrower).toThrowError(
      'Illegal Argument: Pattern is not present'
    );
  });
});
