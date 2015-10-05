'use strict';

describe('domReady event type', function() {
  var delegateInjector = require('inject!../domReady');
  var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
  var delegate = delegateInjector({
    once: publicRequire('once')
  });

  it('triggers rule when the dom ready event occurs', function() {
    var trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(0);

    Simulate.event(document, 'DOMContentLoaded');

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    expect(call.args[0].type).toBe('domready');
    expect(call.args[0].target).toBe(document.location);
    expect(call.args[1]).toBe(document.location);
  });
});
