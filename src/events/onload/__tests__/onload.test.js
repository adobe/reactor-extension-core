'use strict';

describe('onload event type', function() {
  it('triggers rule when the load event occurs', function() {
    var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
    var delegateInjector = require('inject!../onload');
    var delegate = delegateInjector({
      once: publicRequire('once')
    });

    var trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(0);

    Simulate.event(window, 'load');

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    expect(call.args[0].type).toBe('windowload');
    expect(call.args[0].target).toBe(document.location);
    expect(call.args[1]).toBe(document.location);
  });
});
