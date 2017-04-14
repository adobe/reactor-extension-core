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

describe('directCall event type', function() {
  var delegateInjector = require('inject!../directCall');
  var delegate;

  beforeAll(function() {
    delegate = delegateInjector({
      '@turbine/logger': {
        log: function() {}
      }
    });
  });

  it('triggers rule when _satellite.track() is called with matching name', function() {
    var trigger = jasmine.createSpy();

    delegate({
      name: 'foo'
    }, trigger);

    expect(trigger.calls.count()).toBe(0);

    _satellite.track('foo');

    expect(trigger.calls.count()).toBe(1);

    _satellite.track('bar');

    expect(trigger.calls.count()).toBe(1);
  });
});
