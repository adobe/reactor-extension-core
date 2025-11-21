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

import queryString from '@adobe/reactor-query-string';
import { injectQueryStringParameter } from '../queryStringParameter.js';

describe('query string parameter data element delegate', function () {
  let delegate;

  beforeAll(function () {
    delegate = injectQueryStringParameter({
      window: {
        location: {
          search: '?foo=bar'
        }
      },
      queryString
    });
  });

  it('returns a value when a match is found case-insensitively', function () {
    const settings = {
      name: 'foo',
      caseInsensitive: true
    };

    const value = delegate(settings);

    expect(value).toBe('bar');
  });

  it('returns a value when a match is found case-sensitively', function () {
    const settings = {
      name: 'foo'
    };

    const value = delegate(settings);

    expect(value).toBe('bar');
  });

  it('returns undefined when a match is not found case-insensitively', function () {
    const settings = {
      name: 'unicorn',
      caseInsensitive: true
    };

    const value = delegate(settings);

    expect(value).toBe(undefined);
  });

  it('returns undefined when a match is not found case-sensitively', function () {
    const settings = {
      name: 'FOO'
    };

    const value = delegate(settings);

    expect(value).toBe(undefined);
  });
});
