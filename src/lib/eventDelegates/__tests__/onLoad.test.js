'use strict';

describe('onload event type', function() {
  it('triggers rule when the load event occurs', function() {

    var delegateInjector = require('inject!../onLoad');
    var delegate = delegateInjector({
      once: require('@reactor/turbine/src/public/once')
    });

    var trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(0);

    Simulate.event(window, 'load');

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    expect(call.args[0]).toBe(document.location);
    expect(call.args[1].type).toBe('windowload');
    expect(call.args[1].target).toBe(document.location);
  });
});
