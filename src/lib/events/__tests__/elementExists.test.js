'use strict';

var POLL_INTERVAL = 3000;
var publicRequire = require('../../__tests__/helpers/publicRequire');

describe('elementExists event type', function() {
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
    expect(options.call.args[0]).toBe(options.relatedElement);
    expect(options.call.args[1].type).toBe('elementexists');
    expect(options.call.args[1].target).toBe(options.target);
  };

  beforeAll(function() {
    jasmine.clock().install();

    var delegateInjector = require('inject!../elementExists');
    delegate = delegateInjector({
      'weak-map': publicRequire('weak-map')
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
  });

  it('calls trigger with event and related element', function() {
    var aTrigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a'
    }, aTrigger);

    jasmine.clock().tick(POLL_INTERVAL);

    assertTriggerCall({
      call: aTrigger.calls.mostRecent(),
      relatedElement: aElement,
      target: aElement
    });
  });

  it('triggers multiple rules targeting the same element', function() {
    var aTrigger = jasmine.createSpy();
    var a2Trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#a'
    }, aTrigger);

    delegate({
      elementSelector: '#a'
    }, a2Trigger);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(aTrigger.calls.count()).toEqual(1);
    expect(a2Trigger.calls.count()).toEqual(1);
  });

  it('triggers a rule if elementProperties match', function() {
    var trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#b',
      elementProperties: [{
        name: 'innerHTML',
        value: 'b'
      }]
    }, trigger);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(trigger.calls.count()).toEqual(1);
  });

  it('does not trigger a rule if elementProperties do not match', function() {
    var trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#b',
      elementProperties: [{
        name: 'innerHTML',
        value: 'no match'
      }]
    }, trigger);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(trigger.calls.count()).toEqual(0);
  });

  it('continues evaluating elements until elementProperties is satisfied (DTM-6681)', function() {
    var selectorOnlyTrigger = jasmine.createSpy();
    var selectorAndPropsTrigger = jasmine.createSpy();

    delegate({
      elementSelector: 'div'
    }, selectorOnlyTrigger);

    delegate({
      elementSelector: 'div',
      elementProperties: [{
        name: 'innerHTML',
        value: 'added later'
      }]
    }, selectorAndPropsTrigger);

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
