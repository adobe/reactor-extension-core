'use strict';

var outerElement;
var innerElement;

var assertTriggerCall = function(options) {
  expect(options.call.args[0].type).toBe(options.type);
  expect(options.call.args[0].target).toBe(options.target);
  expect(options.call.args[1]).toBe(options.relatedElement);
};

var triggerCustomEvent = function(element, type) {
  var event = document.createEvent('Event');
  event.initEvent(type, true, true);
  element.dispatchEvent(event);
  return event;
};

describe('custom event type', function() {
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../custom');
  var delegate = delegateInjector({
    'get-extension': publicRequire('get-extension')
  });

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

    var event = triggerCustomEvent(innerElement, CUSTOM_EVENT_TYPE);

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    expect(call.args[0]).toBe(event);
    expect(call.args[1]).toBe(outerElement);
  });
});
