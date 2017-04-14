/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
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

var conditionDelegate = require('../hash');

describe('hash condition delegate', function() {

  beforeAll(function() {
    document.location.hash = 'hashtest';
  });

  afterAll(function() {
    document.location.hash = '';
  });

  it('returns true when the hash matches an acceptable string', function() {
    var settings = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: '#hashtest'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the hash does not match an acceptable string', function() {
    var settings = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: '#goo'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the hash matches an acceptable regex', function() {
    var settings = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: 'Has.test',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the hash does not match an acceptable regex', function() {
    var settings = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: '#g.o',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(false);
  });
});
