'use strict';

describe('pageTop event type', function() {
  var delegate = require('../pageTop');

  it('triggers rule when the engine is loaded', function() {
    var trigger = jasmine.createSpy();
    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    expect(call.args[0].type).toBe('pagetop');
    expect(call.args[0].target).toBe(document.location);
    expect(call.args[1]).toBe(document.location);
  });
});
