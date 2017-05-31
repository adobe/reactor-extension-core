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

var POLL_INTERVAL = 3000;
var delegateInjector = require('inject!../dataElementChange');

/**
 * Tests whether a rule will be triggered based on a value change.
 * @param {*} initialValue The initial data element value.
 * @param {Function} getUpdatedValue A function that returns a (potentially) updated value.
 * @param {boolean} shouldTriggerRule Whether we expect a rule to be triggered.
 */
var testValueChange = function(initialValue, getUpdatedValue, shouldTriggerRule) {
  var trigger = jasmine.createSpy();
  var dataElementValue = initialValue;

  var delegate = delegateInjector({
    '@turbine/get-data-element-value': function() { return dataElementValue; }
  });

  delegate({
    name: 'mydataelement'
  }, trigger);

  jasmine.clock().tick(POLL_INTERVAL);

  expect(trigger.calls.count()).toBe(0);

  dataElementValue = getUpdatedValue(dataElementValue);

  jasmine.clock().tick(POLL_INTERVAL);

  if (shouldTriggerRule) {
    expect(trigger.calls.count()).toBe(1);

    var call = trigger.calls.mostRecent();
    expect(call.args[0]).toEqual({
      dataElementName: 'mydataelement'
    });
  } else {
    expect(trigger.calls.count()).toBe(0);
  }
};

describe('data element change event type', function() {
  beforeAll(function() {
    jasmine.clock().install();
  });

  afterAll(function() {
    jasmine.clock().uninstall();
  });

  it('doesn\' trigger rule the first time a data element is evaluated', function() {
    var trigger = jasmine.createSpy();

    var delegate = delegateInjector({
      '@turbine/get-data-element-value': function() { return 'foo'; }
    });

    delegate({
      name: 'mydataelement'
    }, trigger);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(trigger).not.toHaveBeenCalled();
  });

  it('triggers rule when a string changes', function() {
    testValueChange('foo', function() { return 'bar'; }, true);
  });

  it('does not trigger rule when string does not change', function() {
    testValueChange('foo', function() { return 'foo'; }, false);
  });

  it('triggers rule when array changes to string', function() {
    testValueChange([], function() { return 'foo'; }, true);
  });

  it('triggers rule when object changes to array', function() {
    testValueChange({}, function() { return []; }, true);
  });

  it('triggers rule when object changes to a string', function() {
    testValueChange({}, function() { return 'foo'; }, true);
  });

  it('does not trigger rule when empty array changes to a different empty array', function() {
    testValueChange([], function() { return []; }, false);
  });

  it('does not trigger rule when empty object changes to a different empty object', function() {
    testValueChange({}, function() { return {}; }, false);
  });

  it('triggers rule when array item changes', function() {
    var value = ['a', 'b'];

    testValueChange(value, function() {
      value[1] = 'c';
      return value;
    }, true);
  });

  it('does not trigger when array changes to different array with same values', function() {
    var value = ['a', 'b'];
    testValueChange(value, function() { return value.slice(); }, false);
  });

  it('emits an event when a key get added to an object', function() {
    var value = {
      foo: 'bar',
      baz: 'quux'
    };

    testValueChange(value, function() {
      value.foo = 'fuchsia';
      return value;
    }, true);
  });

  it('does not trigger when object changes to different object with same values', function() {
    testValueChange({
      foo: 'bar',
      baz: 'quux'
    }, function() {
      return {
        foo: 'bar',
        baz: 'quux'
      };
    }, false);
  });

  it('triggers rule when object key order changes', function() {
    // This isn't necessarily a good thing, but is a consequence of using JSON.stringify
    // under the hood.
    testValueChange({
      foo: 'bar',
      baz: 'quux'
    }, function() {
      return {
        baz: 'quux',
        foo: 'bar'
      };
    }, true);
  });

  it('does not trigger rule when deep object structures are identical', function() {
    testValueChange({
      a: [
        1,
        'a'
      ]
    }, function() {
      return {
        a: [
          1,
          'a'
        ]
      };
    }, false);
  });

  it('does not trigger rule when deep object structures are identical', function() {
    testValueChange([
      {
        a: 'a',
        b: 'b'
      }
    ], function() {
      return [

        {
          a: 'a',
          b: 'b'
        }
      ];
    }, false);
  });

  it('triggers rule when date changes', function() {
    testValueChange(new Date('2016-01-01'), function() {
      return new Date('2016-02-01');
    }, true);
  });

  it('does not trigger rule when date doesn\'t change', function() {
    testValueChange(new Date('2016-01-01'), function() {
      return new Date('2016-01-01');
    }, false);
  });

  it('triggers multiple rules when data element changes', function() {
    var trigger = jasmine.createSpy();
    var trigger2 = jasmine.createSpy();
    var dataElementValue = 'foo';

    var delegate = delegateInjector({
      '@turbine/get-data-element-value': function() {
        return dataElementValue;
      }
    });

    delegate({
      name: 'mydataelement'
    }, trigger);

    delegate({
      name: 'mydataelement'
    }, trigger2);

    dataElementValue = 'bar';

    jasmine.clock().tick(POLL_INTERVAL);

    expect(trigger).toHaveBeenCalled();
    expect(trigger2).toHaveBeenCalled();
  });
});
