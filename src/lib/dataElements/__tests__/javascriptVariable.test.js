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

var dataElementDelegate = require('../javascriptVariable');

describe('javascript variable data element delegate', function() {
  beforeAll(function() {
    window.a = {
      b: [
        {
          c: 'foo'
        },
        {
          c: 'bar'
        }
      ]
    };
  });

  afterAll(function() {
    delete window.a;
  });

  it('returns a nested object property value', function() {
    var settings = {
      path: 'a.b.1.c'
    };

    var value = dataElementDelegate(settings);

    expect(value).toBe('bar');
  });

  it('returns undefined if path does not exist', function() {
    var settings = {
      path: 'path.that.does.not.exist'
    };

    var value = dataElementDelegate(settings);

    expect(value).toBe(undefined);
  });

  it('finds value when path is prefixed with window', function() {
    var settings = {
      path: 'window.a.b.1.c'
    };
    expect(dataElementDelegate(settings)).toBe('bar');
  });
});
