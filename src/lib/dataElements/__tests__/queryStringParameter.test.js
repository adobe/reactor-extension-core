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

describe('query string parameter data element delegate', function () {
  var injectDelegate = require('inject-loader!../queryStringParameter');
  var delegate;

  beforeAll(function () {
    delegate = injectDelegate({
      '@adobe/reactor-window': {
        location: {
          search: '?foo=bar'
        }
      }
    });
  });

  it('returns a value when a match is found case-insensitively', function () {
    var settings = {
      name: 'foo',
      caseInsensitive: true
    };

    var value = delegate(settings);

    expect(value).toBe('bar');
  });

  it('returns a value when a match is found case-sensitively', function () {
    var settings = {
      name: 'foo'
    };

    var value = delegate(settings);

    expect(value).toBe('bar');
  });

  it('returns undefined when a match is not found case-insensitively', function () {
    var settings = {
      name: 'unicorn',
      caseInsensitive: true
    };

    var value = delegate(settings);

    expect(value).toBe(undefined);
  });

  it('returns undefined when a match is not found case-sensitively', function () {
    var settings = {
      name: 'FOO'
    };

    var value = delegate(settings);

    expect(value).toBe(undefined);
  });
});
