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

var runtimeEnvironmentDelegateInjector = require('inject-loader!../runtimeEnvironment');

describe('runtime environment data element delegate', function () {
  describe('from the event parameter', function () {
    var event;
    var runtimeEnvironmentDelegate = runtimeEnvironmentDelegateInjector();

    beforeEach(function () {
      event = {
        identifier: 'dcr identifier',
        detail: 'dcr detail',
        $type: 'extensionName.moduleName',
        $rule: { id: 'rule id', name: 'rule name' }
      };
    });

    it('returns the direct call rule identifier', function () {
      expect(
        runtimeEnvironmentDelegate({ attribute: 'DCRIdentifier' }, event)
      ).toBe('dcr identifier');
    });

    it('returns the direct call rule detail', function () {
      expect(
        runtimeEnvironmentDelegate({ attribute: 'eventDetail' }, event)
      ).toBe('dcr detail');
    });

    it('returns the event type', function () {
      expect(
        runtimeEnvironmentDelegate({ attribute: 'eventType' }, event)
      ).toBe('extensionName.moduleName');
    });

    it('returns the event rule id', function () {
      expect(runtimeEnvironmentDelegate({ attribute: 'ruleId' }, event)).toBe(
        'rule id'
      );
    });

    it('returns the event rule name', function () {
      expect(runtimeEnvironmentDelegate({ attribute: 'ruleName' }, event)).toBe(
        'rule name'
      );
    });
  });

  describe('from the turbine build info parameter', function () {
    var runtimeEnvironmentDelegate = runtimeEnvironmentDelegateInjector();

    beforeAll(function () {
      mockTurbineVariable({
        buildInfo: { buildDate: 'build date' }
      });
    });

    afterAll(function () {
      resetTurbineVariable();
    });

    it('returns the build date', function () {
      expect(runtimeEnvironmentDelegate({ attribute: 'buildDate' })).toBe(
        'build date'
      );
    });
  });

  describe('from the satellite parameter', function () {
    var runtimeEnvironmentDelegate;
    beforeAll(function () {
      runtimeEnvironmentDelegate = runtimeEnvironmentDelegateInjector({
        '@adobe/reactor-window': {
          _satellite: {
            property: { name: 'property name', id: 'PR123' },
            environment: { stage: 'stage' }
          }
        }
      });
    });

    it('returns the property name', function () {
      expect(runtimeEnvironmentDelegate({ attribute: 'propertyName' })).toBe(
        'property name'
      );
    });

    it('returns the property id', function () {
      expect(runtimeEnvironmentDelegate({ attribute: 'propertyId' })).toBe(
        'PR123'
      );
    });

    it('returns the environment', function () {
      expect(
        runtimeEnvironmentDelegate({ attribute: 'environmentStage' })
      ).toBe('stage');
    });
  });
});
