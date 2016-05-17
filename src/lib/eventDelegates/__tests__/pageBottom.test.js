'use strict';
var Promise = require('@reactor/turbine/src/public/Promise');

var injector = require('inject!../pageBottom');

describe('pageBottom event type', function() {
  it('triggers rule at the bottom of the page', function(done) {
    var fakeDocument;
    var promise;
    var promiseResolve;
    
    fakeDocument = {
      location: 'http://somelocation.com'
    };

    promise = new Promise(function(resolve) {
      promiseResolve = resolve;
    });

    var delegate = injector({
      'document': fakeDocument,
      'page-bottom': promise
    });

    var trigger = jasmine.createSpy();
    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(0);

    promise.then(function() {
      expect(trigger.calls.count()).toBe(1);

      var call = trigger.calls.mostRecent();
      expect(call.args[0]).toBe('http://somelocation.com');
      expect(call.args[1].type).toBe('pagebottom');
      expect(call.args[1].target).toBe('http://somelocation.com');

      done();
    });

    promiseResolve();
  });
});
