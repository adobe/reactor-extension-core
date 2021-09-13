/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

'use strict';

var conditionalValueDelegate = require('../conditionalValue');

describe('conditional value data element delegate', function () {
  it('returns the conditional value when value comparison returns true', function () {
    var settings = {
      leftOperand: 1,
      comparison: {
        operator: 'equals'
      },
      rightOperand: 1,
      conditionalValue: 'a',
      fallbackValue: 'b'
    };

    expect(conditionalValueDelegate(settings)).toBe('a');
  });

  it('returns the falback value when value comparison returns false', function () {
    var settings = {
      leftOperand: 1,
      comparison: {
        operator: 'equals'
      },
      rightOperand: 2,
      conditionalValue: 'a',
      fallbackValue: 'b'
    };

    expect(conditionalValueDelegate(settings)).toBe('b');
  });
});
