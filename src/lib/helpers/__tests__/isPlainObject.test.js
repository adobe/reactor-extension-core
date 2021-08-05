/***************************************************************************************
 * Copyright 2021 Adobe. All rights reserved.
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

var isPlainObject = require('../isPlainObject');

describe('isPlainObject', function () {
  it('returns true for plain objects', function () {
    [
      Object.create({}),
      Object.create(Object.prototype),
      { foo: 'bar' },
      {},
      Object.create(null)
    ].forEach(function (value) {
      expect(isPlainObject(value)).toBeTrue();
    });
  });

  it('returns false for values that are not plain objects', function () {
    function Foo() {
      this.abc = {};
    }

    [
      /foo/,
      function () {},
      1,
      ['foo', 'bar'],
      [],
      new Foo(),
      null,
      new Date()
    ].forEach(function (value) {
      expect(isPlainObject(value)).toBeFalse();
    });
  });
});
