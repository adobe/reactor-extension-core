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

describe('direct call event delegate', function () {
  var delegate = require('../directCall');

  var trigger = jasmine.createSpy();
  var log = jasmine.createSpy();

  beforeAll(function () {
    trigger = jasmine.createSpy();
    delegate(
      {
        identifier: 'foo'
      },
      trigger
    );
    mockTurbineVariable({
      logger: {
        log: log
      }
    });
  });

  afterAll(function () {
    resetTurbineVariable();
  });

  beforeEach(function () {
    trigger.calls.reset();
    log.calls.reset();
  });

  it('triggers rule with matching identifier and detail passed', function () {
    var detail = { a: 'b' };

    _satellite.track('foo', detail);

    expect(trigger.calls.count()).toBe(1);
    expect(trigger.calls.mostRecent().args[0]).toEqual({
      identifier: 'foo',
      detail: detail
    });

    expect(
      turbine.logger.log
    ).toHaveBeenCalledWith(
      'Rules using the direct call event type with identifier "foo" ' +
        'have been triggered with additional detail:',
      { a: 'b' }
    );
  });

  it('triggers rule with matching identifier and no detail passed', function () {
    _satellite.track('foo');

    expect(trigger.calls.count()).toBe(1);
    expect(trigger.calls.mostRecent().args[0]).toEqual({
      identifier: 'foo',
      detail: undefined
    });

    expect(turbine.logger.log).toHaveBeenCalledWith(
      'Rules using the direct call event type with identifier "foo" have been triggered.'
    );
  });

  it('logs a message when no rules found with matching identifier', function () {
    _satellite.track('baz');

    expect(turbine.logger.log).toHaveBeenCalledWith(
      '"baz" does not match any direct call identifiers.'
    );
  });
});
