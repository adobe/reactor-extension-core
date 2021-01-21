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

describe('media time played event delegate', function () {
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
      target: options.target,
      amount: options.amount,
      unit: options.unit
    });
  };

  beforeAll(function () {
    jasmine.clock().install();
    delegate = require('../mediaTimePlayed');
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

  it(
    'triggers multiple rules with the same amount using second unit targeting the ' +
      'same element',
    function () {
      var aTrigger = jasmine.createSpy();
      var a2Trigger = jasmine.createSpy();

      delegate(
        {
          elementSelector: '#a',
          amount: 5,
          unit: 'second',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        aTrigger
      );

      delegate(
        {
          elementSelector: '#a',
          amount: 5,
          unit: 'second',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        a2Trigger
      );

      expect(aTrigger.calls.count()).toEqual(0);
      expect(a2Trigger.calls.count()).toEqual(0);

      var seekable = {
        start: function () {
          return 30;
        },
        end: function () {
          return 100;
        },
        length: 1
      };

      aElement.seekable = seekable;
      aElement.currentTime = 34;

      Simulate.timeupdate(aElement);

      expect(aTrigger.calls.count()).toEqual(0);
      expect(a2Trigger.calls.count()).toEqual(0);

      aElement.currentTime = 35;

      Simulate.timeupdate(aElement);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(1);

      assertTriggerCall({
        call: aTrigger.calls.first(),
        element: aElement,
        target: aElement,
        amount: 5,
        unit: 'second'
      });

      assertTriggerCall({
        call: a2Trigger.calls.first(),
        element: aElement,
        target: aElement,
        amount: 5,
        unit: 'second'
      });
    }
  );

  it(
    'triggers multiple rules with the same amount using second unit targeting ' +
      'nested elements',
    function () {
      var aTrigger = jasmine.createSpy();
      var bTrigger = jasmine.createSpy();

      delegate(
        {
          elementSelector: '#a',
          amount: 5,
          unit: 'second',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        aTrigger
      );

      delegate(
        {
          elementSelector: '#b',
          amount: 5,
          unit: 'second',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        bTrigger
      );

      expect(aTrigger.calls.count()).toEqual(0);
      expect(bTrigger.calls.count()).toEqual(0);

      var seekable = {
        start: function () {
          return 30;
        },
        end: function () {
          return 100;
        },
        length: 1
      };

      bElement.seekable = seekable;
      bElement.currentTime = 34;

      Simulate.timeupdate(bElement);

      expect(aTrigger.calls.count()).toEqual(0);
      expect(bTrigger.calls.count()).toEqual(0);

      bElement.currentTime = 35;

      Simulate.timeupdate(bElement);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(1);

      assertTriggerCall({
        call: aTrigger.calls.first(),
        element: aElement,
        target: bElement,
        amount: 5,
        unit: 'second'
      });

      assertTriggerCall({
        call: bTrigger.calls.first(),
        element: bElement,
        target: bElement,
        amount: 5,
        unit: 'second'
      });
    }
  );

  it(
    'triggers multiple rules with the different amounts using second unit targeting nested ' +
      'elements',
    function () {
      var aTrigger = jasmine.createSpy();
      var bTrigger = jasmine.createSpy();

      delegate(
        {
          elementSelector: '#a',
          amount: 5,
          unit: 'second',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        aTrigger
      );

      delegate(
        {
          elementSelector: '#b',
          amount: 10,
          unit: 'second',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        bTrigger
      );

      expect(aTrigger.calls.count()).toEqual(0);
      expect(bTrigger.calls.count()).toEqual(0);

      var seekable = {
        start: function () {
          return 30;
        },
        end: function () {
          return 100;
        },
        length: 1
      };

      bElement.seekable = seekable;
      bElement.currentTime = 34;

      Simulate.timeupdate(bElement);

      expect(aTrigger.calls.count()).toEqual(0);
      expect(bTrigger.calls.count()).toEqual(0);

      bElement.currentTime = 35;

      Simulate.timeupdate(bElement);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(0);

      bElement.currentTime = 42;

      Simulate.timeupdate(bElement);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(1);

      assertTriggerCall({
        call: aTrigger.calls.first(),
        element: aElement,
        target: bElement,
        amount: 5,
        unit: 'second'
      });

      assertTriggerCall({
        call: bTrigger.calls.first(),
        element: bElement,
        target: bElement,
        amount: 10,
        unit: 'second'
      });
    }
  );

  it(
    'triggers multiple rules with the different amounts using second unit targeting the same ' +
      'element',
    function () {
      var aTrigger = jasmine.createSpy();
      var a2Trigger = jasmine.createSpy();

      delegate(
        {
          elementSelector: '#a',
          amount: 5,
          unit: 'second',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        aTrigger
      );

      delegate(
        {
          elementSelector: '#a',
          amount: 10,
          unit: 'second',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        a2Trigger
      );

      expect(aTrigger.calls.count()).toEqual(0);
      expect(a2Trigger.calls.count()).toEqual(0);

      var seekable = {
        start: function () {
          return 30;
        },
        end: function () {
          return 100;
        },
        length: 1
      };

      aElement.seekable = seekable;
      aElement.currentTime = 34;

      Simulate.timeupdate(aElement);

      expect(aTrigger.calls.count()).toEqual(0);
      expect(a2Trigger.calls.count()).toEqual(0);

      aElement.currentTime = 35;

      Simulate.timeupdate(aElement);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(0);

      aElement.currentTime = 42;

      Simulate.timeupdate(aElement);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(1);

      assertTriggerCall({
        call: aTrigger.calls.first(),
        element: aElement,
        target: aElement,
        amount: 5,
        unit: 'second'
      });

      assertTriggerCall({
        call: a2Trigger.calls.first(),
        element: aElement,
        target: aElement,
        amount: 10,
        unit: 'second'
      });
    }
  );

  it(
    'triggers multiple rules with the different amounts using percent unit targeting nested ' +
      'elements',
    function () {
      var aTrigger = jasmine.createSpy();
      var bTrigger = jasmine.createSpy();

      delegate(
        {
          elementSelector: '#a',
          amount: 5,
          unit: 'percent',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        aTrigger
      );

      delegate(
        {
          elementSelector: '#b',
          amount: 10,
          unit: 'percent',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        bTrigger
      );

      expect(aTrigger.calls.count()).toEqual(0);
      expect(bTrigger.calls.count()).toEqual(0);

      var seekable = {
        start: function () {
          return 30;
        },
        end: function () {
          return 100;
        },
        length: 1
      };

      bElement.seekable = seekable;
      bElement.currentTime = 31; // 1%, 1s complete.

      Simulate.timeupdate(bElement);

      expect(aTrigger.calls.count()).toEqual(0);
      expect(bTrigger.calls.count()).toEqual(0);

      bElement.currentTime = 35; // 7%, 5s complete.

      Simulate.timeupdate(bElement);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(0);

      bElement.currentTime = 60; // 43%, 30s complete

      Simulate.timeupdate(bElement);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(bTrigger.calls.count()).toEqual(1);

      assertTriggerCall({
        call: aTrigger.calls.first(),
        element: aElement,
        target: bElement,
        amount: 5,
        unit: 'percent'
      });

      assertTriggerCall({
        call: bTrigger.calls.first(),
        element: bElement,
        target: bElement,
        amount: 10,
        unit: 'percent'
      });
    }
  );

  it(
    'triggers multiple rules with the same amount using different units targeting the same ' +
      'element',
    function () {
      var aTrigger = jasmine.createSpy();
      var a2Trigger = jasmine.createSpy();

      delegate(
        {
          elementSelector: '#a',
          amount: 5,
          unit: 'second',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        aTrigger
      );

      delegate(
        {
          elementSelector: '#a',
          amount: 5,
          unit: 'percent',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        a2Trigger
      );

      expect(aTrigger.calls.count()).toEqual(0);
      expect(a2Trigger.calls.count()).toEqual(0);

      var seekable = {
        start: function () {
          return 30;
        },
        end: function () {
          return 100;
        },
        length: 1
      };

      aElement.seekable = seekable;

      aElement.currentTime = 33; // 4%, 3s complete.
      Simulate.timeupdate(aElement);

      expect(aTrigger.calls.count()).toEqual(0);
      expect(a2Trigger.calls.count()).toEqual(0);

      aElement.currentTime = 34; // 6%, 4s complete.
      Simulate.timeupdate(aElement);

      expect(aTrigger.calls.count()).toEqual(0);
      expect(a2Trigger.calls.count()).toEqual(1);

      aElement.currentTime = 35; // 7%, 5s complete.
      Simulate.timeupdate(aElement);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(1);

      assertTriggerCall({
        call: aTrigger.calls.first(),
        element: aElement,
        target: aElement,
        amount: 5,
        unit: 'second'
      });

      assertTriggerCall({
        call: a2Trigger.calls.first(),
        element: aElement,
        target: aElement,
        amount: 5,
        unit: 'percent'
      });
    }
  );
});
