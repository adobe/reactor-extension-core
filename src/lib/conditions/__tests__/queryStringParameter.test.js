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

var conditionDelegateInjector = require('inject-loader!../queryStringParameter');

describe('query string parameter condition delegate', function () {
  var conditionDelegate;

  var getSettings = function (name, value, valueIsRegex) {
    return {
      name: name,
      value: value,
      valueIsRegex: valueIsRegex
    };
  };

  beforeAll(function () {
    conditionDelegate = conditionDelegateInjector({
      '@adobe/reactor-window': {
        location: {
          search: '?testParam=foo'
        }
      }
    });
  });

  it('returns true when value matches using regular string', function () {
    var settings = getSettings('testParam', 'foo', false);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when value does not match using regular string', function () {
    var settings = getSettings('testParam', 'goo', false);
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when value matches using regex', function () {
    var settings = getSettings('testParam', '^F[ojd]o$', true);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when value does not match using regex', function () {
    var settings = getSettings('testParam', '^g[ojd]o$', true);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
