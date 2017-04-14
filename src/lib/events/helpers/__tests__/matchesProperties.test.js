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

describe('matchesProperties', function() {
  var matchesProperties = require('../matchesProperties');
  var element;
  
  beforeAll(function() {
    element = document.createElement('div');
    element.className = 'flashy';
    element.innerHTML = 'scooter';
  });
  
  it('returns true if the string property value matches', function() {
    var matches = matchesProperties(element, [
      {
        name: 'className',
        value: 'flashy'
      },
      {
        name: 'innerHTML',
        value: 'scooter'
      }
    ]);

    expect(matches).toBe(true);
  });

  it('returns true if the string property value does not match', function() {
    var matches = matchesProperties(element, [
      {
        name: 'className',
        value: 'flashy'
      },
      {
        name: 'innerHTML',
        value: 'hot rod'
      }
    ]);

    expect(matches).toBe(false);
  });

  it('returns true if the regex property value matches', function() {
    var matches = matchesProperties(element, [
      {
        name: 'className',
        value: 'flashy'
      },
      {
        name: 'innerHTML',
        value: 'scoot..',
        valueIsRegex: true
      }
    ]);

    expect(matches).toBe(true);
  });

  it('returns false if the regex property value does not match', function() {
    var matches = matchesProperties(element, [
      {
        name: 'className',
        value: 'flashy'
      },
      {
        name: 'innerHTML',
        value: 'hot r..',
        valueIsRegex: true
      }
    ]);

    expect(matches).toBe(false);
  });
});
