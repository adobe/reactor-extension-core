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
var cookie = require('js-cookie');
var conditionDelegate = require('../cookie');

describe('cookie condition delegate', function () {
  beforeAll(function () {
    cookie.set('test', 'foo');
  });

  afterAll(function () {
    cookie.remove('test');
  });

  it('returns true when the cookie matches the string value', function () {
    var settings = { name: 'test', value: 'foo' };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the cookie does not match the string value', function () {
    var settings = { name: 'test', value: 'cake' };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the cookie matches the regex value', function () {
    var settings = { name: 'test', value: 'F.o', valueIsRegex: true };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the cookie does not match the regex value', function () {
    var settings = { name: 'test', value: 'g.o', valueIsRegex: true };
    expect(conditionDelegate(settings)).toBe(false);
  });
});
