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

var deepMerge = require('../deepMerge');

describe('deepMerge', function () {
  it('handles non-plain-object sources gracefully', function () {
    var result = deepMerge(
      {},
      ['a', 'b', 'c'],
      'de',
      123456789,
      true,
      function () {},
      /abc/,
      null,
      {
        f: 'g'
      },
      undefined,
      {
        h: 'i'
      }
    );

    // This follows the same approach as the native Object.assign.
    expect(result).toEqual({
      0: 'd',
      1: 'e',
      2: 'c',
      f: 'g',
      h: 'i'
    });
  });

  it('deeply merges while cloning all objects and arrays', function () {
    var targetObj = { existing: 'value' };
    var firstObj = { a: { b: 123 } };
    var secondObj = { a: { b: 456 }, c: { d: true } };
    var thirdObj = { c: { e: false }, f: [{ g: 'h' }, { i: 'j' }] };
    var fourthObj = { f: [{ i: 'j' }, { k: 'l' }, ['m', 'n']] };
    var result = deepMerge(targetObj, firstObj, secondObj, thirdObj, fourthObj);

    expect(result).toEqual({
      existing: 'value',
      a: {
        b: 456
      },
      c: { d: true, e: false },
      f: [{ g: 'h' }, { i: 'j' }, { i: 'j' }, { k: 'l' }, ['m', 'n']]
    });
    expect(targetObj).toBe(result);
    expect(firstObj.a).not.toBe(result.a);
    expect(firstObj).toEqual({ a: { b: 123 } });
    expect(secondObj.a).not.toBe(result.a);
    expect(secondObj.c).not.toBe(result.c);
    expect(secondObj).toEqual({ a: { b: 456 }, c: { d: true } });
    expect(thirdObj.c).not.toBe(result.c);
    expect(thirdObj.f).not.toBe(result.f);
    expect(thirdObj.f[0]).not.toBe(result.f[0]);
    expect(thirdObj.f[1]).not.toBe(result.f[1]);
    expect(thirdObj).toEqual({ c: { e: false }, f: [{ g: 'h' }, { i: 'j' }] });
    expect(fourthObj.f).not.toBe(result.f);
    expect(fourthObj.f[0]).not.toBe(result.f[2]);
    expect(fourthObj.f[1]).not.toBe(result.f[3]);
    expect(fourthObj.f[2]).not.toBe(result.f[4]);
    expect(fourthObj).toEqual({ f: [{ i: 'j' }, { k: 'l' }, ['m', 'n']] });
  });

  it('does not merge undefined property values unless dest value does not exist', function () {
    var result = deepMerge(
      {},
      {
        a: 'b'
      },
      { a: undefined, b: undefined }
    );

    expect(result).toEqual({ a: 'b', b: undefined });
  });

  it('merges null property values', function () {
    var result = deepMerge(
      {},
      {
        a: 'b'
      },
      { a: null }
    );

    expect(result).toEqual({ a: null });
  });

  it('merges undefined and null array values', function () {
    var result = deepMerge(
      {},
      {
        a: ['b']
      },
      { a: ['c', undefined, null, 'd'] }
    );

    expect(result).toEqual({ a: ['b', 'c', undefined, null, 'd'] });
  });

  it('merges objects built using Object.create', function () {
    var firstObject = Object.create({
      a: 'b'
    });
    firstObject.c = 'd';

    var secondObject = Object.create(Object.prototype);
    secondObject.e = 'f';

    var thirdObject = Object.create(null);
    thirdObject.g = 'h';

    var result = deepMerge({}, firstObject, secondObject, thirdObject);

    expect(result).toEqual({
      c: 'd',
      e: 'f',
      g: 'h'
    });
  });

  it('does not attempt to merge contents of non-arrays and non-plain-objects', function () {
    function Foo() {
      this.abc = {};
    }

    function Bar() {
      this.def = {};
    }

    var firstObj = {
      a: new Date(0),
      b: /abc/,
      c: Foo,
      d: new Foo(),
      e: undefined,
      f: null,
      g: 1,
      h: 'a',
      i: true
    };
    var secondObj = {
      a: new Date(1),
      b: /def/,
      c: Bar,
      d: new Bar(),
      e: undefined,
      f: null,
      g: 2,
      h: 'b',
      i: false
    };
    var result = deepMerge({}, firstObj, secondObj);

    expect(result.a).toBe(secondObj.a);
    expect(result.b).toBe(secondObj.b);
    expect(result.c).toBe(secondObj.c);
    expect(result.d).toBe(secondObj.d);
    expect(result.e).toBe(secondObj.e);
    expect(result.f).toBe(secondObj.f);
    expect(result.g).toBe(secondObj.g);
    expect(result.h).toBe(secondObj.h);
    expect(result.i).toBe(secondObj.i);
  });
});
