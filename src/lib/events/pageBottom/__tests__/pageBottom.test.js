'use strict';

describe('pageBottom event type', function() {
  var delegate = require('../pageBottom');

  it('triggers rule when _satellite.pageBottom() is called', function() {
    var trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(0);

    _satellite.pageBottom();

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    expect(call.args[0].type).toBe('pagebottom');
    expect(call.args[0].target).toBe(document.location);
    expect(call.args[1]).toBe(document.location);
  });
});
