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

var POLL_INTERVAL = 3000;

describe('element exists event delegate', function () {
  var delegate;
  var aElement;
  var bElement;

  var createElements = function () {
    aElement = document.createElement('div');
    aElement.id = 'a';
    aElement.innerHTML = 'a';
    document.body.insertBefore(aElement, document.body.firstChild);

    bElement = document.createElement('div');
    bElement.id = 'b';
    bElement.innerHTML = 'b';
    aElement.appendChild(bElement);
  };

  var removeElements = function () {
    if (aElement) {
      document.body.removeChild(aElement);
    }
    aElement = bElement = null;
  };

  var assertTriggerCall = function (options) {
    expect(options.call.args[0]).toEqual({
      element: options.element,
      target: options.element
    });
  };

  beforeAll(function () {
    jasmine.clock().install();
    delegate = require('../elementExists');
  });

  afterAll(function () {
    jasmine.clock().uninstall();
  });

  beforeEach(function () {
    createElements();
  });

  afterEach(function () {
    removeElements();
  });

  it('calls trigger with event and related element', function () {
    var aTrigger = jasmine.createSpy();

    delegate(
      {
        elementSelector: '#a'
      },
      aTrigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    assertTriggerCall({
      call: aTrigger.calls.mostRecent(),
      element: aElement,
      target: aElement
    });
  });

  it('triggers multiple rules targeting the same element', function () {
    var aTrigger = jasmine.createSpy();
    var a2Trigger = jasmine.createSpy();

    delegate(
      {
        elementSelector: '#a'
      },
      aTrigger
    );

    delegate(
      {
        elementSelector: '#a'
      },
      a2Trigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    expect(aTrigger.calls.count()).toEqual(1);
    expect(a2Trigger.calls.count()).toEqual(1);
  });

  it('triggers multiple rules targeting the same element in the defined order', function () {
    var result = null;
    var aTrigger = jasmine.createSpy().and.callFake(function () {
      result = 'aTrigger';
    });
    var a2Trigger = jasmine.createSpy().and.callFake(function () {
      result = 'a2Trigger';
    });

    delegate(
      {
        elementSelector: '#a'
      },
      aTrigger
    );

    delegate(
      {
        elementSelector: '#a'
      },
      a2Trigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    expect(result).toEqual('a2Trigger');
  });

  it('triggers a rule if elementProperties match', function () {
    var trigger = jasmine.createSpy();

    delegate(
      {
        elementSelector: '#b',
        elementProperties: [
          {
            name: 'innerHTML',
            value: 'b'
          }
        ]
      },
      trigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    expect(trigger.calls.count()).toEqual(1);
  });

  it('does not trigger a rule if elementProperties do not match', function () {
    var trigger = jasmine.createSpy();

    delegate(
      {
        elementSelector: '#b',
        elementProperties: [
          {
            name: 'innerHTML',
            value: 'no match'
          }
        ]
      },
      trigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    expect(trigger.calls.count()).toEqual(0);
  });

  it('continues evaluating elements until elementProperties is satisfied (DTM-6681)', function () {
    var selectorOnlyTrigger = jasmine.createSpy();
    var selectorAndPropsTrigger = jasmine.createSpy();

    delegate(
      {
        elementSelector: 'div'
      },
      selectorOnlyTrigger
    );

    delegate(
      {
        elementSelector: 'div',
        elementProperties: [
          {
            name: 'innerHTML',
            value: 'added later'
          }
        ]
      },
      selectorAndPropsTrigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    expect(selectorOnlyTrigger.calls.count()).toBe(1);
    expect(selectorAndPropsTrigger.calls.count()).toBe(0);

    var addedLaterElement = document.createElement('div');
    addedLaterElement.innerHTML = 'added later';
    document.body.appendChild(addedLaterElement);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(selectorOnlyTrigger.calls.count()).toBe(1);
    expect(selectorAndPropsTrigger.calls.count()).toBe(1);

    document.body.removeChild(addedLaterElement);
  });
});
