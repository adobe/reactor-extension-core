'use strict';

var outerElement;
var innerElement;

var triggerCustomEvent = function(element, type) {
  var event = document.createEvent('Event');
  event.initEvent(type, true, true);
  element.dispatchEvent(event);
  return event;
};

describe('custom event type', function() {
  var createBubblyInjector = require('inject!../../helpers/createBubbly');
  var createBubbly = createBubblyInjector({
    'create-data-stash': require('@reactor/turbine/src/public/createDataStash')
  });

  var delegateInjector = require('inject!../custom');
  var delegate = delegateInjector({
    '../helpers/createBubbly.js': createBubbly
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
    expect(call.args[0]).toBe(outerElement);
    expect(call.args[1]).toBe(event);
  });
});
