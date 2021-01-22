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
var dataElementDelegate = require('../cookie');

describe('cookie data element delegate', function () {
  beforeAll(function () {
    cookie.set('foo', 'bar');
  });

  afterAll(function () {
    cookie.remove('foo');
  });

  it('returns the value of a cookie', function () {
    var settings = {
      name: 'foo'
    };

    expect(dataElementDelegate(settings)).toBe('bar');
  });

  it('returns undefined if the cookie is not set', function () {
    var settings = {
      name: 'unicorn'
    };

    expect(dataElementDelegate(settings)).toBe(undefined);
  });
});
