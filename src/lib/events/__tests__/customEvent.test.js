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

var outerElement;
var innerElement;

var triggerCustomEvent = function(element, type, detail) {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent(type, true, true, detail);
  element.dispatchEvent(event);
  return event;
};

describe('custom event event delegate', function() {
  var delegate = require('../customEvent');

  beforeAll(function() {
    outerElement = document.createElement('div');
    outerElement.id = 'outer';

    innerElement = document.createElement('div');
    innerElement.id = 'inner';
    outerElement.appendChild(innerElement);

    document.body.insertBefore(outerElement, document.body.firstChild);
  });

  afterAll(function() {
    document.body.removeChild(outerElement);
  });

  it('triggers rule when event occurs', function() {
    var CUSTOM_EVENT_TYPE = 'foo';

    var trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#outer',
      type: CUSTOM_EVENT_TYPE,
      bubbleFireIfParent: true
    }, trigger);

    triggerCustomEvent(innerElement, CUSTOM_EVENT_TYPE, { foo: 'bar' });

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    expect(call.args[0]).toEqual({
      element: outerElement,
      target: innerElement,
      nativeEvent: jasmine.any(Object),
      detail: { foo: 'bar' }
    });
  });

  it('only triggers rule pertaining to event type', function() {
    var CUSTOM_EVENT_TYPE_A = 'foo';
    var CUSTOM_EVENT_TYPE_B = 'bar';

    var triggerA = jasmine.createSpy();

    delegate({
      elementSelector: '#outer',
      type: CUSTOM_EVENT_TYPE_A,
      bubbleFireIfParent: true
    }, triggerA);

    var triggerB = jasmine.createSpy();

    delegate({
      elementSelector: '#outer',
      type: CUSTOM_EVENT_TYPE_B,
      bubbleFireIfParent: true
    }, triggerB);

    triggerCustomEvent(outerElement, CUSTOM_EVENT_TYPE_B);

    expect(triggerA.calls.count()).toBe(0);
    expect(triggerB.calls.count()).toBe(1);
  });

  it('only triggers each rule once when multiple rules watching for same event type', function() {
    var CUSTOM_EVENT_TYPE = 'foo';

    var triggerA = jasmine.createSpy();

    delegate({
      elementSelector: '#outer',
      type: CUSTOM_EVENT_TYPE,
      bubbleFireIfParent: true
    }, triggerA);

    var triggerB = jasmine.createSpy();

    delegate({
      elementSelector: '#outer',
      type: CUSTOM_EVENT_TYPE,
      bubbleFireIfParent: true
    }, triggerB);

    triggerCustomEvent(outerElement, CUSTOM_EVENT_TYPE);

    expect(triggerA.calls.count()).toBe(1);
    expect(triggerB.calls.count()).toBe(1);
  });
});
