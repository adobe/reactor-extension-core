/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

describe('timePlayed event type', function() {
  var delegate;
  var aElement;
  var bElement;

  var createElements = function() {
    aElement = document.createElement('div');
    aElement.id = 'a';
    aElement.innerHTML = 'a';
    document.body.insertBefore(aElement, document.body.firstChild);

    bElement = document.createElement('div');
    bElement.id = 'b';
    bElement.innerHTML = 'b';
    aElement.appendChild(bElement);
  };

  var removeElements = function() {
    if (aElement) {
      document.body.removeChild(aElement);
    }
    aElement = bElement = null;
  };

  var assertTriggerCall = function(options) {
    var unitPrefix = options.unit === 'second' ? 's' : '%';
    expect(options.call.args[0]).toBe(options.relatedElement);
    expect(options.call.args[1].type).toBe('videoplayed(' + options.amount + unitPrefix + ')');
    expect(options.call.args[1].target).toBe(options.target);
  };

  beforeAll(function() {
    jasmine.clock().install();
    delegate = require('../timePlayed');
  });

  afterAll(function() {
    jasmine.clock().uninstall();
  });

  beforeEach(function() {
    createElements();
  });

  afterEach(function() {
    removeElements();
  });

  it('triggers multiple rules with the same amount using second unit targeting the ' +
      'same element', function() {
    var aTrigger = jasmine.createSpy();
    var a2Trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      amount: 5,
      unit: 'second',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, aTrigger);

    delegate({
      elementSelector: '#a',
      amount: 5,
      unit: 'second',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, a2Trigger);

    expect(aTrigger.calls.count()).toEqual(0);
    expect(a2Trigger.calls.count()).toEqual(0);

    var seekable = {
      start: function() {
        return 30;
      },
      end: function() {
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
      relatedElement: aElement,
      target: aElement,
      amount: 5,
      unit: 'second'
    });

    assertTriggerCall({
      call: a2Trigger.calls.first(),
      relatedElement: aElement,
      target: aElement,
      amount: 5,
      unit: 'second'
    });
  });

  it('triggers multiple rules with the same amount using second unit targeting ' +
      'nested elements', function() {
    var aTrigger = jasmine.createSpy();
    var bTrigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      amount: 5,
      unit: 'second',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, aTrigger);

    delegate({
      elementSelector: '#b',
      amount: 5,
      unit: 'second',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, bTrigger);

    expect(aTrigger.calls.count()).toEqual(0);
    expect(bTrigger.calls.count()).toEqual(0);

    var seekable = {
      start: function() {
        return 30;
      },
      end: function() {
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
      relatedElement: aElement,
      target: bElement,
      amount: 5,
      unit: 'second'
    });

    assertTriggerCall({
      call: bTrigger.calls.first(),
      relatedElement: bElement,
      target: bElement,
      amount: 5,
      unit: 'second'
    });
  });

  it('triggers multiple rules with the different amounts using second unit targeting nested ' +
      'elements', function() {
    var aTrigger = jasmine.createSpy();
    var bTrigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      amount: 5,
      unit: 'second',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, aTrigger);

    delegate({
      elementSelector: '#b',
      amount: 10,
      unit: 'second',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, bTrigger);

    expect(aTrigger.calls.count()).toEqual(0);
    expect(bTrigger.calls.count()).toEqual(0);

    var seekable = {
      start: function() {
        return 30;
      },
      end: function() {
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
      relatedElement: aElement,
      target: bElement,
      amount: 5,
      unit: 'second'
    });

    assertTriggerCall({
      call: bTrigger.calls.first(),
      relatedElement: bElement,
      target: bElement,
      amount: 10,
      unit: 'second'
    });
  });

  it('triggers multiple rules with the different amounts using second unit targeting the same ' +
      'element', function() {
    var aTrigger = jasmine.createSpy();
    var a2Trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      amount: 5,
      unit: 'second',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, aTrigger);

    delegate({
      elementSelector: '#a',
      amount: 10,
      unit: 'second',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, a2Trigger);

    expect(aTrigger.calls.count()).toEqual(0);
    expect(a2Trigger.calls.count()).toEqual(0);

    var seekable = {
      start: function() {
        return 30;
      },
      end: function() {
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
      relatedElement: aElement,
      target: aElement,
      amount: 5,
      unit: 'second'
    });

    assertTriggerCall({
      call: a2Trigger.calls.first(),
      relatedElement: aElement,
      target: aElement,
      amount: 10,
      unit: 'second'
    });
  });

  it('triggers multiple rules with the different amounts using percent unit targeting nested ' +
      'elements', function() {
    var aTrigger = jasmine.createSpy();
    var bTrigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      amount: 5,
      unit: 'percent',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, aTrigger);

    delegate({
      elementSelector: '#b',
      amount: 10,
      unit: 'percent',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, bTrigger);

    expect(aTrigger.calls.count()).toEqual(0);
    expect(bTrigger.calls.count()).toEqual(0);

    var seekable = {
      start: function() {
        return 30;
      },
      end: function() {
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
      relatedElement: aElement,
      target: bElement,
      amount: 5,
      unit: 'percent'
    });

    assertTriggerCall({
      call: bTrigger.calls.first(),
      relatedElement: bElement,
      target: bElement,
      amount: 10,
      unit: 'percent'
    });
  });

  it('triggers multiple rules with the same amount using different units targeting the same ' +
      'element', function() {
    var aTrigger = jasmine.createSpy();
    var a2Trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      amount: 5,
      unit: 'second',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, aTrigger);

    delegate({
      elementSelector: '#a',
      amount: 5,
      unit: 'percent',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, a2Trigger);

    expect(aTrigger.calls.count()).toEqual(0);
    expect(a2Trigger.calls.count()).toEqual(0);

    var seekable = {
      start: function() {
        return 30;
      },
      end: function() {
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
      relatedElement: aElement,
      target: aElement,
      amount: 5,
      unit: 'second'
    });

    assertTriggerCall({
      call: a2Trigger.calls.first(),
      relatedElement: aElement,
      target: aElement,
      amount: 5,
      unit: 'percent'
    });
  });
});
