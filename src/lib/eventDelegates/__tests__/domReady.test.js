'use strict';

describe('domReady event type', function() {
  var delegateInjector = require('inject!../domReady');
  var delegate = delegateInjector({
    once: require('@reactor/turbine/src/public/once')
  });

  it('triggers rule when the dom ready event occurs', function() {
    var trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(0);

    Simulate.event(document, 'DOMContentLoaded');

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    expect(call.args[0]).toBe(document.location);
    expect(call.args[1].type).toBe('domready');
    expect(call.args[1].target).toBe(document.location);
  });
});
