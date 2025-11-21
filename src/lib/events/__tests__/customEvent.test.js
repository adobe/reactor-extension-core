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

import { injectCustomEvent } from '../customEvent.js';
import { vi } from 'vitest';
const delegate = injectCustomEvent({ window });

let outerElement;
let innerElement;

const triggerCustomEvent = function (element, type, detail) {
  const event = document.createEvent('CustomEvent');
  event.initCustomEvent(type, true, true, detail);
  element.dispatchEvent(event);
  return event;
};

describe('custom event event delegate', function () {
  beforeAll(function () {
    outerElement = document.createElement('div');
    outerElement.id = 'outer';

    innerElement = document.createElement('div');
    innerElement.id = 'inner';
    outerElement.appendChild(innerElement);

    document.body.insertBefore(outerElement, document.body.firstChild);
  });

  afterAll(function () {
    document.body.removeChild(outerElement);
  });

  it('triggers rule when event is dispatched from element', function () {
    const CUSTOM_EVENT_TYPE = 'foo';

    const trigger = vi.fn();

    delegate(
      {
        elementSelector: '#outer',
        type: CUSTOM_EVENT_TYPE,
        bubbleFireIfParent: true
      },
      trigger
    );

    triggerCustomEvent(innerElement, CUSTOM_EVENT_TYPE, { foo: 'bar' });

    expect(trigger.mock.calls.length).toBe(1);
    const call = trigger.mock.lastCall;
    expect(call[0]).toEqual({
      element: outerElement,
      target: innerElement,
      nativeEvent: jasmine.any(Object),
      detail: { foo: 'bar' }
    });
  });

  it('triggers rule when event is dispatched from window', function () {
    const CUSTOM_EVENT_TYPE = 'foo';

    const trigger = vi.fn();

    delegate(
      {
        type: CUSTOM_EVENT_TYPE
      },
      trigger
    );

    triggerCustomEvent(window, CUSTOM_EVENT_TYPE, { foo: 'bar' });

    expect(trigger.mock.calls.length).toBe(1);
    const call = trigger.mock.lastCall;
    expect(call[0]).toEqual({
      element: window,
      target: window,
      nativeEvent: jasmine.any(Object),
      detail: { foo: 'bar' }
    });
  });

  it('triggers rule when event is dispatched from document', function () {
    const CUSTOM_EVENT_TYPE = 'foo';

    const trigger = vi.fn();

    delegate(
      {
        type: CUSTOM_EVENT_TYPE
      },
      trigger
    );

    triggerCustomEvent(document, CUSTOM_EVENT_TYPE, { foo: 'bar' });

    expect(trigger.mock.calls.length).toBe(1);
    const call = trigger.mock.lastCall;
    expect(call[0]).toEqual({
      element: document,
      target: document,
      nativeEvent: jasmine.any(Object),
      detail: { foo: 'bar' }
    });
  });

  it('only triggers rule pertaining to event type', function () {
    const CUSTOM_EVENT_TYPE_A = 'foo';
    const CUSTOM_EVENT_TYPE_B = 'bar';

    const triggerA = vi.fn();

    delegate(
      {
        elementSelector: '#outer',
        type: CUSTOM_EVENT_TYPE_A,
        bubbleFireIfParent: true
      },
      triggerA
    );

    const triggerB = vi.fn();

    delegate(
      {
        elementSelector: '#outer',
        type: CUSTOM_EVENT_TYPE_B,
        bubbleFireIfParent: true
      },
      triggerB
    );

    triggerCustomEvent(outerElement, CUSTOM_EVENT_TYPE_B);

    expect(triggerA.mock.calls.length).toBe(0);
    expect(triggerB.mock.calls.length).toBe(1);
  });

  it('only triggers each rule once when multiple rules watching for same event type', function () {
    const CUSTOM_EVENT_TYPE = 'foo';

    const triggerA = vi.fn();

    delegate(
      {
        elementSelector: '#outer',
        type: CUSTOM_EVENT_TYPE,
        bubbleFireIfParent: true
      },
      triggerA
    );

    const triggerB = vi.fn();

    delegate(
      {
        elementSelector: '#outer',
        type: CUSTOM_EVENT_TYPE,
        bubbleFireIfParent: true
      },
      triggerB
    );

    triggerCustomEvent(outerElement, CUSTOM_EVENT_TYPE);

    expect(triggerA.mock.calls.length).toBe(1);
    expect(triggerB.mock.calls.length).toBe(1);
  });
});
