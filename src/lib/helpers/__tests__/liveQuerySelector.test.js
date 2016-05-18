'use strict';

var POLL_INTERVAL = 3000;

var publicRequire = require('../../__tests__/helpers/publicRequire');

var liveQuerySelectorInjector = require('inject!../liveQuerySelector');
var liveQuerySelector = liveQuerySelectorInjector({
  'once': publicRequire('once'),
  'create-data-stash': publicRequire('create-data-stash')
});

describe('liveQuerySelector', function() {
  beforeAll(function() {
    jasmine.clock().install();
  });

  afterAll(function() {
    jasmine.clock().uninstall();
  });

  it('detects an element added before polling starts', function() {
    var div = document.createElement('div');
    div.className = 'foo';
    document.body.appendChild(div);

    var callback = jasmine.createSpy();
    liveQuerySelector('.foo', callback);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback.calls.count()).toBe(1);

    document.body.removeChild(div);
  });

  it('detects an element added after polling starts', function() {
    // Polling doesn't start until liveQuerySelector is called once.
    liveQuerySelector('a', function() {});
    jasmine.clock().tick(5000);

    var div = document.createElement('div');
    div.className = 'foo';
    document.body.appendChild(div);

    var callback = jasmine.createSpy();
    liveQuerySelector('.foo', callback);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback.calls.count()).toBe(1);

    document.body.removeChild(div);
  });

  it('calls a callback twice when two elements exist that match the selector', function() {
    var div = document.createElement('div');
    div.className = 'foo';
    document.body.appendChild(div);

    var a = document.createElement('a');
    a.className = 'foo';
    div.appendChild(a);

    var callback = jasmine.createSpy();
    liveQuerySelector('.foo', callback);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback.calls.count()).toBe(2);

    document.body.removeChild(div);
  });

  it('calls two callbacks targeting the same element', function() {
    var div = document.createElement('div');
    div.className = 'foo';
    document.body.appendChild(div);

    var callback1 = jasmine.createSpy();
    liveQuerySelector('.foo', callback1);

    var callback2 = jasmine.createSpy();
    liveQuerySelector('.foo', callback2);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback1.calls.count()).toBe(1);
    expect(callback2.calls.count()).toBe(1);

    document.body.removeChild(div);
  });

  it('does not call the same callback again if the element is re-added', function() {
    var div = document.createElement('div');
    div.className = 'foo';
    document.body.appendChild(div);

    var callback = jasmine.createSpy();
    liveQuerySelector('.foo', callback);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback.calls.count()).toBe(1);

    document.body.removeChild(div);

    jasmine.clock().tick(POLL_INTERVAL);

    document.body.appendChild(div);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback.calls.count()).toBe(1);

    document.body.removeChild(div);
  });

});
