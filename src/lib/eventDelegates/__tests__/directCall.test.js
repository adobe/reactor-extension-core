'use strict';

describe('directCall event type', function() {
  var delegateInjector = require('inject!../directCall');
  var delegate;

  beforeAll(function() {
    delegate = delegateInjector({
      'logger': {
        log: function() {}
      }
    });
  });

  it('triggers rule when _satellite.track() is called with matching name', function() {
    var trigger = jasmine.createSpy();

    delegate({
      name: 'foo'
    }, trigger);

    expect(trigger.calls.count()).toBe(0);

    _satellite.track('foo');

    expect(trigger.calls.count()).toBe(1);

    _satellite.track('bar');

    expect(trigger.calls.count()).toBe(1);
  });
});
