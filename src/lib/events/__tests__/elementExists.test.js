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

import WeakMap from '../helpers/weakMap.js';
import { injectElementExists } from '../elementExists.js';
import { vi } from 'vitest';
const POLL_INTERVAL = 3000;

describe('element exists event delegate', function () {
  const delegate = injectElementExists({ window, document, WeakMap });
  let aElement;
  let bElement;

  const createElements = function () {
    aElement = document.createElement('div');
    aElement.id = 'a';
    aElement.innerHTML = 'a';
    document.body.insertBefore(aElement, document.body.firstChild);

    bElement = document.createElement('div');
    bElement.id = 'b';
    bElement.innerHTML = 'b';
    aElement.appendChild(bElement);
  };

  const removeElements = function () {
    if (aElement) {
      document.body.removeChild(aElement);
    }
    aElement = bElement = null;
  };

  const assertTriggerCall = function (options) {
    expect(options.call[0]).toEqual({
      element: options.element,
      target: options.element
    });
  };

  beforeAll(function () {
    vi.useFakeTimers();
  });

  afterAll(function () {
    vi.useRealTimers();
  });

  beforeEach(function () {
    createElements();
  });

  afterEach(function () {
    removeElements();
  });

  it('calls trigger with event and related element', function () {
    const aTrigger = vi.fn();

    delegate(
      {
        elementSelector: '#a'
      },
      aTrigger
    );

    vi.advanceTimersByTime(POLL_INTERVAL);

    assertTriggerCall({
      call: aTrigger.mock.lastCall,
      element: aElement,
      target: aElement
    });
  });

  it('triggers multiple rules targeting the same element', function () {
    const aTrigger = vi.fn();
    const a2Trigger = vi.fn();

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

    vi.advanceTimersByTime(POLL_INTERVAL);

    expect(aTrigger.mock.calls.length).toEqual(1);
    expect(a2Trigger.mock.calls.length).toEqual(1);
  });

  it('triggers multiple rules targeting the same element in the defined order', function () {
    let result = null;
    const aTrigger = vi.fn().and.callFake(function () {
      result = 'aTrigger';
    });
    const a2Trigger = vi.fn().and.callFake(function () {
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

    vi.advanceTimersByTime(POLL_INTERVAL);

    expect(result).toEqual('a2Trigger');
  });

  it('triggers a rule if elementProperties match', function () {
    const trigger = vi.fn();

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

    vi.advanceTimersByTime(POLL_INTERVAL);

    expect(trigger.mock.calls.length).toEqual(1);
  });

  it('does not trigger a rule if elementProperties do not match', function () {
    const trigger = vi.fn();

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

    vi.advanceTimersByTime(POLL_INTERVAL);

    expect(trigger.mock.calls.length).toEqual(0);
  });

  it('continues evaluating elements until elementProperties is satisfied (DTM-6681)', function () {
    const selectorOnlyTrigger = vi.fn();
    const selectorAndPropsTrigger = vi.fn();

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

    vi.advanceTimersByTime(POLL_INTERVAL);

    expect(selectorOnlyTrigger.mock.calls.length).toBe(1);
    expect(selectorAndPropsTrigger.mock.calls.length).toBe(0);

    const addedLaterElement = document.createElement('div');
    addedLaterElement.innerHTML = 'added later';
    document.body.appendChild(addedLaterElement);

    vi.advanceTimersByTime(POLL_INTERVAL);

    expect(selectorOnlyTrigger.mock.calls.length).toBe(1);
    expect(selectorAndPropsTrigger.mock.calls.length).toBe(1);

    document.body.removeChild(addedLaterElement);
  });
});
