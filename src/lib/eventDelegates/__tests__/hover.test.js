'use strict';

describe('hover event type', function() {
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
    expect(options.call.args[0].type).toBe('hover(' + options.delay + ')');
    expect(options.call.args[0].target).toBe(options.target);
    expect(options.call.args[0].delay).toBe(options.delay);
    expect(options.call.args[1]).toBe(options.relatedElement);
  };

  beforeAll(function() {
    jasmine.clock().install();
    var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
    var delegateInjector = require('inject!../hover');
    delegate = delegateInjector({
      resourceProvider: publicRequire('resourceProvider'),
      liveQuerySelector: publicRequire('liveQuerySelector'),
      createDataStash: publicRequire('createDataStash')
    });
  });

  afterAll(function() {
    jasmine.clock().uninstall();
  });

  beforeEach(function() {
    createElements();
  });

  afterEach(function() {
    Simulate.mouseleave(bElement);
    Simulate.mouseleave(aElement);
    removeElements();
  });

  it('triggers multiple rules with the no delay targeting nested elements', function() {
    var aTrigger = jasmine.createSpy();
    var bTrigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, aTrigger);

    delegate({
      elementSelector: '#b',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, bTrigger);

    __tickGlobalPoll();

    Simulate.mouseenter(aElement);

    expect(aTrigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: aTrigger.calls.mostRecent(),
      relatedElement: aElement,
      target: aElement,
      delay: 0
    });

    Simulate.mouseenter(bElement);

    // Rule A ran again because the hover from element B also "bubbled up" to element A.
    expect(aTrigger.calls.count()).toEqual(2);

    assertTriggerCall({
      call: aTrigger.calls.mostRecent(),
      relatedElement: aElement,
      target: bElement,
      delay: 0
    });

    expect(bTrigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: bTrigger.calls.mostRecent(),
      relatedElement: bElement,
      target: bElement,
      delay: 0
    });
  });

  it('triggers multiple rules with no delay targeting the same element', function() {
    var aTrigger = jasmine.createSpy();
    var a2Trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, aTrigger);

    delegate({
      elementSelector: '#a',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false
    }, a2Trigger);

    __tickGlobalPoll();

    Simulate.mouseenter(aElement);

    expect(aTrigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: aTrigger.calls.mostRecent(),
      relatedElement: aElement,
      target: aElement,
      delay: 0
    });

    expect(a2Trigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: a2Trigger.calls.mostRecent(),
      relatedElement: aElement,
      target: aElement,
      delay: 0
    });
  });

  it('triggers multiple rules with the same delay targeting nested elements', function() {
    var aTrigger = jasmine.createSpy();
    var bTrigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false,
      delay: 1000
    }, aTrigger);

    delegate({
      elementSelector: '#b',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false,
      delay: 1000
    }, bTrigger);

    __tickGlobalPoll();

    Simulate.mouseenter(aElement);
    Simulate.mouseenter(bElement);

    jasmine.clock().tick(800);

    Simulate.mouseleave(aElement);
    Simulate.mouseleave(bElement);

    expect(aTrigger.calls.count()).toEqual(0);
    expect(bTrigger.calls.count()).toEqual(0);

    Simulate.mouseenter(aElement);
    Simulate.mouseenter(bElement);

    jasmine.clock().tick(1200);

    // Because the rules are on the same delay, the hover event from element B also executes
    // rule A when it "bubbles up".
    expect(aTrigger.calls.count()).toEqual(2);

    assertTriggerCall({
      call: aTrigger.calls.first(),
      relatedElement: aElement,
      target: aElement,
      delay: 1000
    });

    assertTriggerCall({
      call: aTrigger.calls.mostRecent(),
      relatedElement: aElement,
      target: bElement,
      delay: 1000
    });

    expect(bTrigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: bTrigger.calls.mostRecent(),
      relatedElement: bElement,
      target: bElement,
      delay: 1000
    });
  });

  it('triggers multiple rules with different delays targeting nested elements', function() {
    var aTrigger = jasmine.createSpy();
    var bTrigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false,
      delay: 2000
    }, aTrigger);

    delegate({
      elementSelector: '#b',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false,
      delay: 1000
    }, bTrigger);


    __tickGlobalPoll();

    Simulate.mouseenter(aElement);
    Simulate.mouseenter(bElement);

    jasmine.clock().tick(800);

    Simulate.mouseleave(aElement);
    Simulate.mouseleave(bElement);

    expect(aTrigger.calls.count()).toEqual(0);
    expect(bTrigger.calls.count()).toEqual(0);

    Simulate.mouseenter(aElement);
    Simulate.mouseenter(bElement);

    jasmine.clock().tick(1200);

    expect(aTrigger.calls.count()).toEqual(0);
    expect(bTrigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: bTrigger.calls.mostRecent(),
      relatedElement: bElement,
      target: bElement,
      delay: 1000
    });

    jasmine.clock().tick(1000);

    // Because the rules are on different delays, the hover event from element B doesn't
    // execute rule A when it "bubbles up".
    expect(aTrigger.calls.count()).toEqual(1);
    expect(bTrigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: aTrigger.calls.mostRecent(),
      relatedElement: aElement,
      target: aElement,
      delay: 2000
    });
  });

  it('triggers multiple rules with the same delay targeting the same element', function() {
    var aTrigger = jasmine.createSpy();
    var a2Trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false,
      delay: 1000
    }, aTrigger);

    delegate({
      elementSelector: '#a',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false,
      delay: 1000
    }, a2Trigger);

    __tickGlobalPoll();

    Simulate.mouseenter(aElement);

    jasmine.clock().tick(800);

    Simulate.mouseleave(aElement);

    expect(aTrigger.calls.count()).toEqual(0);
    expect(a2Trigger.calls.count()).toEqual(0);

    Simulate.mouseenter(aElement);

    jasmine.clock().tick(1200);

    expect(aTrigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: aTrigger.calls.mostRecent(),
      relatedElement: aElement,
      target: aElement,
      delay: 1000
    });

    expect(a2Trigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: a2Trigger.calls.mostRecent(),
      relatedElement: aElement,
      target: aElement,
      delay: 1000
    });
  });

  it('triggers multiple rules with different delays targeting the same element', function() {
    var aTrigger = jasmine.createSpy();
    var a2Trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false,
      delay: 1000
    }, aTrigger);

    delegate({
      elementSelector: '#a',
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: false,
      delay: 2000
    }, a2Trigger);

    __tickGlobalPoll();

    Simulate.mouseenter(aElement);

    jasmine.clock().tick(800);

    Simulate.mouseleave(aElement);

    expect(aTrigger.calls.count()).toEqual(0);
    expect(a2Trigger.calls.count()).toEqual(0);

    Simulate.mouseenter(aElement);

    jasmine.clock().tick(1200);

    expect(aTrigger.calls.count()).toEqual(1);
    expect(a2Trigger.calls.count()).toEqual(0);

    assertTriggerCall({
      call: aTrigger.calls.mostRecent(),
      relatedElement: aElement,
      target: aElement,
      delay: 1000
    });

    jasmine.clock().tick(1000);

    expect(aTrigger.calls.count()).toEqual(1);
    expect(a2Trigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: a2Trigger.calls.mostRecent(),
      relatedElement: aElement,
      target: aElement,
      delay: 2000
    });
  });

  it('triggers a rule when the element matches elementProperties', function() {
    var bTrigger = jasmine.createSpy();

    delegate({
      elementSelector: '#b',
      elementProperties: [{
        name: 'innerHTML',
        value: 'b'
      }]
    }, bTrigger);

    __tickGlobalPoll();

    Simulate.mouseenter(bElement);

    expect(bTrigger.calls.count()).toEqual(1);
  });

  it('does not trigger rule when the element does not match elementProperties', function() {
    var bTrigger = jasmine.createSpy();

    delegate({
      elementSelector: '#b',
      elementProperties: [{
        name: 'innerHTML',
        value: 'd'
      }]
    }, bTrigger);

    __tickGlobalPoll();

    Simulate.mouseenter(bElement);

    expect(bTrigger.calls.count()).toEqual(0);
  });

});
