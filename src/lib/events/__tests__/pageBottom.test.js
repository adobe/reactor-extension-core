'use strict';

var injector = require('inject!../pageBottom');

describe('pageBottom event type', function() {
  it('triggers rule at the bottom of the page', function() {
    var fakeDocument;

    fakeDocument = {
      location: 'http://somelocation.com'
    };

    var triggerPageBottom;
    var onPageBottom = function(callback) {
      triggerPageBottom = callback;
    };

    var delegate = injector({
      'document': fakeDocument,
      'on-page-bottom': onPageBottom
    });

    var trigger = jasmine.createSpy();
    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(0);

    triggerPageBottom();

    expect(trigger.calls.count()).toBe(1);

    var call = trigger.calls.mostRecent();
    expect(call.args[0]).toBe('http://somelocation.com');
    expect(call.args[1].type).toBe('pagebottom');
    expect(call.args[1].target).toBe('http://somelocation.com');
  });
});
