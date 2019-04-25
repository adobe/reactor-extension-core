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

var conditionDelegate = require('../sampling');

describe('sampling condition delegate', function() {
  it('returns false when rate is 0', function() {
    expect(conditionDelegate({ rate: 0 })).toBeFalse();
  });

  it('returns true when rate is 1', function() {
    expect(conditionDelegate({ rate: 1 })).toBeTrue();
  });

  describe('cohort persistence', function() {
    var cleanUp = function() {
      window.localStorage.clear();
    };

    afterEach(cleanUp);

    beforeAll(cleanUp);

    it('persists cohort to local storage when condition returns true', function() {
      conditionDelegate(
        {
          rate: 1,
          persistCohort: true
        },
        {
          $rule: {
            id: 'RL123'
          }
        }
      );

      expect(window.localStorage.getItem('com.adobe.reactor.core.sampling.cohorts.RL123.1'))
        .toBe('true');
    });

    it('persists cohort to local storage when condition returns false', function() {
      conditionDelegate(
        {
          rate: 0,
          persistCohort: true
        },
        {
          $rule: {
            id: 'RL123'
          }
        }
      );

      expect(window.localStorage.getItem('com.adobe.reactor.core.sampling.cohorts.RL123.0'))
        .toBe('false');
    });

    it('uses persisted cohort', function() {
      [true, false].forEach(function(includedInCohort) {
        window.localStorage.setItem(
          'com.adobe.reactor.core.sampling.cohorts.RL123.0.5',
          includedInCohort ? 'true' : 'false'
        );

        for (var i = 0; i < 10; i++) {
          expect(conditionDelegate(
            {
              rate: 0.5,
              persistCohort: true
            },
            {
              $rule: {
                id: 'RL123'
              }
            }
          )).toBe(includedInCohort);
        }
      });
    });

    it('does not persist cohort when persistCohort is not true', function() {
      conditionDelegate(
        {
          rate: 1
        },
        {
          $rule: {
            id: 'RL123'
          }
        }
      );

      expect(window.localStorage.getItem('com.adobe.reactor.core.sampling.cohorts.RL123.1'))
        .toBe(null);
    });
  });
});
