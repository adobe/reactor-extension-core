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

import Simulate from 'simulate';
import { injectHover } from '../hover.js';
import liveQuerySelector, { __reset as resetLiveQuerySelector } from '../helpers/liveQuerySelector.js';
import { vi } from 'vitest';

const POLL_INTERVAL = 3000;

describe('hover event delegate', function () {
  let delegate;
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
      target: options.target,
      delay: options.delay
    });
  };

  beforeEach(function () {
    jasmine.clock().install();
    delegate = injectHover({ liveQuerySelector });
    createElements();
  });

  afterEach(function () {
    Simulate.mouseleave(bElement);
    Simulate.mouseleave(aElement);
    removeElements();

    jasmine.clock().uninstall();

    // We need to reset the liveQuerySelector, otherwise it will affect the next test that is run.
    resetLiveQuerySelector();
  });

  it(
    'can properly parse settings.delay when it is a string ' +
      '(from data element value)',
    function () {
      const trigger = vi.fn();

      delegate(
        {
          elementSelector: '#a',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false,
          delay: '1000'
        },
        trigger
      );

      jasmine.clock().tick(POLL_INTERVAL);

      Simulate.mouseenter(aElement);

      jasmine.clock().tick(1100);

      expect(trigger.mock.calls.length).toEqual(1);

      assertTriggerCall({
        call: trigger.mock.lastCall,
        element: aElement,
        target: aElement,
        delay: 1000 // the string was properly parsed to a number
      });
    }
  );

  it('triggers multiple rules with no delay targeting nested elements', function () {
    const aTrigger = vi.fn();
    const bTrigger = vi.fn();

    delegate(
      {
        elementSelector: '#a',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false
      },
      aTrigger
    );

    delegate(
      {
        elementSelector: '#b',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false
      },
      bTrigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    Simulate.mouseenter(aElement);

    expect(aTrigger.mock.calls.length).toEqual(1);

    assertTriggerCall({
      call: aTrigger.mock.lastCall,
      element: aElement,
      target: aElement,
      delay: 0
    });

    Simulate.mouseenter(bElement);

    // Rule A ran again because the hover from element B also "bubbled up" to element A.
    expect(aTrigger.mock.calls.length).toEqual(2);

    assertTriggerCall({
      call: aTrigger.mock.lastCall,
      element: aElement,
      target: bElement,
      delay: 0
    });

    expect(bTrigger.mock.calls.length).toEqual(1);

    assertTriggerCall({
      call: bTrigger.mock.lastCall,
      element: bElement,
      target: bElement,
      delay: 0
    });
  });

  it('triggers multiple rules with no delay targeting the same element', function () {
    const aTrigger = vi.fn();
    const a2Trigger = vi.fn();

    delegate(
      {
        elementSelector: '#a',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false
      },
      aTrigger
    );

    delegate(
      {
        elementSelector: '#a',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false
      },
      a2Trigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    Simulate.mouseenter(aElement);

    expect(aTrigger.mock.calls.length).toEqual(1);

    assertTriggerCall({
      call: aTrigger.mock.lastCall,
      element: aElement,
      target: aElement,
      delay: 0
    });

    expect(a2Trigger.mock.calls.length).toEqual(1);

    assertTriggerCall({
      call: a2Trigger.mock.lastCall,
      element: aElement,
      target: aElement,
      delay: 0
    });
  });

  it('triggers multiple rules with the same delay targeting nested elements', function () {
    const aTrigger = vi.fn();
    const bTrigger = vi.fn();

    delegate(
      {
        elementSelector: '#a',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false,
        delay: 1000
      },
      aTrigger
    );

    delegate(
      {
        elementSelector: '#b',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false,
        delay: 1000
      },
      bTrigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    Simulate.mouseenter(aElement);
    Simulate.mouseenter(bElement);

    jasmine.clock().tick(800);

    Simulate.mouseleave(aElement);
    Simulate.mouseleave(bElement);

    expect(aTrigger.mock.calls.length).toEqual(0);
    expect(bTrigger.mock.calls.length).toEqual(0);

    Simulate.mouseenter(aElement);
    Simulate.mouseenter(bElement);

    jasmine.clock().tick(1200);

    // Because the rules are on the same delay, the hover event from element B also executes
    // rule A when it "bubbles up".
    expect(aTrigger.mock.calls.length).toEqual(2);

    assertTriggerCall({
      call: aTrigger.mock.calls[0],
      element: aElement,
      target: aElement,
      delay: 1000
    });

    assertTriggerCall({
      call: aTrigger.mock.lastCall,
      element: aElement,
      target: bElement,
      delay: 1000
    });

    expect(bTrigger.mock.calls.length).toEqual(1);

    assertTriggerCall({
      call: bTrigger.mock.lastCall,
      element: bElement,
      target: bElement,
      delay: 1000
    });
  });

  it('triggers multiple rules with different delays targeting nested elements', function () {
    const aTrigger = vi.fn();
    const bTrigger = vi.fn();

    delegate(
      {
        elementSelector: '#a',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false,
        delay: 2000
      },
      aTrigger
    );

    delegate(
      {
        elementSelector: '#b',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false,
        delay: 1000
      },
      bTrigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    Simulate.mouseenter(aElement);
    Simulate.mouseenter(bElement);

    jasmine.clock().tick(800);

    Simulate.mouseleave(aElement);
    Simulate.mouseleave(bElement);

    expect(aTrigger.mock.calls.length).toEqual(0);
    expect(bTrigger.mock.calls.length).toEqual(0);

    Simulate.mouseenter(aElement);
    Simulate.mouseenter(bElement);

    jasmine.clock().tick(1200);

    expect(aTrigger.mock.calls.length).toEqual(0);
    expect(bTrigger.mock.calls.length).toEqual(1);

    assertTriggerCall({
      call: bTrigger.mock.lastCall,
      element: bElement,
      target: bElement,
      delay: 1000
    });

    jasmine.clock().tick(1000);

    // Because the rules are on different delays, the hover event from element B doesn't
    // execute rule A when it "bubbles up".
    expect(aTrigger.mock.calls.length).toEqual(1);
    expect(bTrigger.mock.calls.length).toEqual(1);

    assertTriggerCall({
      call: aTrigger.mock.lastCall,
      element: aElement,
      target: aElement,
      delay: 2000
    });
  });

  it('triggers multiple rules with the same delay targeting the same element', function () {
    const aTrigger = vi.fn();
    const a2Trigger = vi.fn();

    delegate(
      {
        elementSelector: '#a',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false,
        delay: 1000
      },
      aTrigger
    );

    delegate(
      {
        elementSelector: '#a',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false,
        delay: 1000
      },
      a2Trigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    Simulate.mouseenter(aElement);

    jasmine.clock().tick(800);

    Simulate.mouseleave(aElement);

    expect(aTrigger.mock.calls.length).toEqual(0);
    expect(a2Trigger.mock.calls.length).toEqual(0);

    Simulate.mouseenter(aElement);

    jasmine.clock().tick(1200);

    expect(aTrigger.mock.calls.length).toEqual(1);

    assertTriggerCall({
      call: aTrigger.mock.lastCall,
      element: aElement,
      target: aElement,
      delay: 1000
    });

    expect(a2Trigger.mock.calls.length).toEqual(1);

    assertTriggerCall({
      call: a2Trigger.mock.lastCall,
      element: aElement,
      target: aElement,
      delay: 1000
    });
  });

  it('triggers multiple rules with different delays targeting the same element', function () {
    const aTrigger = vi.fn();
    const a2Trigger = vi.fn();

    delegate(
      {
        elementSelector: '#a',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false,
        delay: 1000
      },
      aTrigger
    );

    delegate(
      {
        elementSelector: '#a',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false,
        delay: 2000
      },
      a2Trigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    Simulate.mouseenter(aElement);

    jasmine.clock().tick(800);

    Simulate.mouseleave(aElement);

    expect(aTrigger.mock.calls.length).toEqual(0);
    expect(a2Trigger.mock.calls.length).toEqual(0);

    Simulate.mouseenter(aElement);

    jasmine.clock().tick(1200);

    expect(aTrigger.mock.calls.length).toEqual(1);
    expect(a2Trigger.mock.calls.length).toEqual(0);

    assertTriggerCall({
      call: aTrigger.mock.lastCall,
      element: aElement,
      target: aElement,
      delay: 1000
    });

    jasmine.clock().tick(1000);

    expect(aTrigger.mock.calls.length).toEqual(1);
    expect(a2Trigger.mock.calls.length).toEqual(1);

    assertTriggerCall({
      call: a2Trigger.mock.lastCall,
      element: aElement,
      target: aElement,
      delay: 2000
    });
  });

  it('triggers a rule when the element matches elementProperties', function () {
    const bTrigger = vi.fn();

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
      bTrigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    Simulate.mouseenter(bElement);

    expect(bTrigger.mock.calls.length).toEqual(1);
  });

  it('does not trigger rule when the element does not match elementProperties', function () {
    const bTrigger = vi.fn();

    delegate(
      {
        elementSelector: '#b',
        elementProperties: [
          {
            name: 'innerHTML',
            value: 'd'
          }
        ]
      },
      bTrigger
    );

    jasmine.clock().tick(POLL_INTERVAL);

    Simulate.mouseenter(bElement);

    expect(bTrigger.mock.calls.length).toEqual(0);
  });
});
