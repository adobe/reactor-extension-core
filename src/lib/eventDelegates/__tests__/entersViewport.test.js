'use strict';

describe('entersViewport event type', function() {
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
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
    expect(options.call.args[0].type).toBe('inview');
    expect(options.call.args[0].target).toBe(options.target);
    expect(options.call.args[0].inviewDelay).toBe(options.delay);
    expect(options.call.args[1]).toBe(options.relatedElement);
  };

  beforeAll(function() {
    jasmine.clock().install();
    var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
    var delegateInjector = require('inject!../entersViewport');
    delegate = delegateInjector({
      poll: publicRequire('poll'),
      createDataStash: publicRequire('createDataStash'),
      getResource: publicRequire('getResource')
    });
  });

  afterAll(function() {
    jasmine.clock().uninstall();
  });

  beforeEach(function() {
    createElements();
  });

  afterEach(function() {
    removeElements();
    window.scrollTo(0, 0);
  });

  it('calls trigger with event and related element', function() {
    var aTrigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a'
    }, aTrigger);

    __tickGlobalPoll();

    assertTriggerCall({
      call: aTrigger.calls.mostRecent(),
      relatedElement: aElement,
      target: aElement
    });
  });

  it('triggers multiple rules targeting the same element with no delay', function() {
    var aTrigger = jasmine.createSpy();
    var a2Trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a'
    }, aTrigger);

    delegate({
      elementSelector: '#a'
    }, a2Trigger);

    __tickGlobalPoll();

    expect(aTrigger.calls.count()).toEqual(1);
    expect(a2Trigger.calls.count()).toEqual(1);
  });

  it('triggers multiple rules targeting the same element with same delay', function() {
    var aTrigger = jasmine.createSpy();
    var a2Trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      delay: 100000
    }, aTrigger);

    delegate({
      elementSelector: '#a',
      delay: 100000
    }, a2Trigger);

    __tickGlobalPoll();

    expect(aTrigger.calls.count()).toEqual(0);
    expect(a2Trigger.calls.count()).toEqual(0);

    jasmine.clock().tick(100000);

    expect(aTrigger.calls.count()).toEqual(1);
    expect(a2Trigger.calls.count()).toEqual(1);
  });

  it('triggers multiple rules targeting the same element with different delays', function() {
    var aTrigger = jasmine.createSpy();
    var a2Trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a',
      delay: 100000
    }, aTrigger);

    delegate({
      elementSelector: '#a',
      delay: 200000
    }, a2Trigger);

    __tickGlobalPoll();

    expect(aTrigger.calls.count()).toEqual(0);
    expect(a2Trigger.calls.count()).toEqual(0);

    jasmine.clock().tick(100000);

    expect(aTrigger.calls.count()).toEqual(1);
    expect(a2Trigger.calls.count()).toEqual(0);

    jasmine.clock().tick(100000);

    expect(aTrigger.calls.count()).toEqual(1);
    expect(a2Trigger.calls.count()).toEqual(1);
  });

  it('triggers multiple rules targeting the same element with different selectors', function() {
    var aTrigger = jasmine.createSpy();
    var a2Trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a'
    }, aTrigger);

    delegate({
      elementSelector: 'div#a'
    }, a2Trigger);

    __tickGlobalPoll();

    expect(aTrigger.calls.count()).toEqual(1);
    expect(a2Trigger.calls.count()).toEqual(1);
  });

  it('triggers rule when elementProperties match', function() {
    var bTrigger = jasmine.createSpy();

    delegate({
      elementSelector: '#b',
      elementProperties: [{
        name: 'innerHTML',
        value: 'b'
      }]
    }, bTrigger);

    __tickGlobalPoll();

    expect(bTrigger.calls.count()).toEqual(1);
  });

  it('does not trigger rule when elementProperties do not match', function() {
    var bTrigger = jasmine.createSpy();

    delegate({
      elementSelector: '#b',
      elementProperties: [{
        name: 'innerHTML',
        value: 'no match'
      }]
    }, bTrigger);

    __tickGlobalPoll();

    expect(bTrigger.calls.count()).toEqual(0);
  });

  // iOS Safari doesn't allow iframes to have overflow (scrollbars) but instead pushes the
  // iframe's height to match the height of the content. Since by default Karma loads tests into an
  // iFrame, these scrolling tests fail. There is a setting to not use an iFrame, but it's not
  // awesome because you have to make sure every browser you're testing on is not blocking pop-ups.
  // That is, until this issue is resolved: https://github.com/karma-runner/karma/issues/849
  // Until then, we're skipping these tests on iOS.
  if (!isIOS) {
    describe('with scrolling', function() {
      it('triggers rule with no delay', function() {
        aElement.style.position = 'absolute';
        aElement.style.top = '3000px';

        var aTrigger = jasmine.createSpy();

        delegate({
          elementSelector: '#a'
        }, aTrigger);

        Simulate.event(window, 'scroll');

        // The rule shouldn't be triggered because the element isn't in view.
        expect(aTrigger.calls.count()).toEqual(0);

        window.scrollTo(0, 3000);
        Simulate.event(window, 'scroll');

        expect(aTrigger.calls.count()).toEqual(1);
      });

      it('triggers rules with various delays targeting elements at various positions', function() {
        aElement.style.position = 'absolute';
        aElement.style.top = '10000px';

        bElement.style.position = 'absolute';
        bElement.style.top = '10000px';

        var aTrigger = jasmine.createSpy();
        var bTrigger = jasmine.createSpy();
        var b2Trigger = jasmine.createSpy();

        delegate({
          elementSelector: '#a'
        }, aTrigger);

        delegate({
          elementSelector: '#b',
          delay: 50000
        }, bTrigger);

        delegate({
          elementSelector: '#b',
          delay: 200000
        }, b2Trigger);

        __tickGlobalPoll();

        expect(aTrigger.calls.count()).toEqual(0);
        expect(bTrigger.calls.count()).toEqual(0);
        expect(b2Trigger.calls.count()).toEqual(0);

        window.scrollTo(0, 10000);
        __tickGlobalPoll();

        expect(aTrigger.calls.count()).toEqual(1);
        expect(bTrigger.calls.count()).toEqual(0);
        expect(b2Trigger.calls.count()).toEqual(0);

        window.scrollTo(0, 0);
        __tickGlobalPoll();

        window.scrollTo(0, 10000);
        __tickGlobalPoll();

        // The first trigger should only be called the first time the element comes into view.
        expect(aTrigger.calls.count()).toEqual(1);
        expect(bTrigger.calls.count()).toEqual(0);
        expect(b2Trigger.calls.count()).toEqual(0);

        window.scrollTo(0, 20000);
        __tickGlobalPoll();

        expect(aTrigger.calls.count()).toEqual(1);
        expect(bTrigger.calls.count()).toEqual(0);
        expect(b2Trigger.calls.count()).toEqual(0);

        window.scrollTo(0, 0);
        __tickGlobalPoll();

        // Give enough time for the configured delay time to pass. The b element rules
        // shouldn't be triggered because the b element is no longer in view.
        jasmine.clock().tick(100000);

        expect(aTrigger.calls.count()).toEqual(1);
        expect(bTrigger.calls.count()).toEqual(0);
        expect(b2Trigger.calls.count()).toEqual(0);

        window.scrollTo(0, 20000);
        __tickGlobalPoll();

        // Give enough time for the configured delay time to
        // pass. The second trigger should be called.
        jasmine.clock().tick(50000);
        expect(aTrigger.calls.count()).toEqual(1);
        expect(bTrigger.calls.count()).toEqual(1);
        expect(b2Trigger.calls.count()).toEqual(0);

        // A different rule watching for the same element but an even longer delay time? Oh my!
        jasmine.clock().tick(200000);
        expect(aTrigger.calls.count()).toEqual(1);
        expect(bTrigger.calls.count()).toEqual(1);
        expect(b2Trigger.calls.count()).toEqual(1);
      });
    });
  }
});
