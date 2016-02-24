'use strict';

var liveQuerySelectorInjector = require('inject!../liveQuerySelector');
var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
var liveQuerySelector = liveQuerySelectorInjector({
  once: publicRequire('once'),
  getExtension: publicRequire('getExtension'),
  createDataStash: publicRequire('createDataStash')
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

    __tickGlobalPoll();

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

    __tickGlobalPoll();

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

    __tickGlobalPoll();

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

    __tickGlobalPoll();

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

    __tickGlobalPoll();

    expect(callback.calls.count()).toBe(1);

    document.body.removeChild(div);

    __tickGlobalPoll();

    document.body.appendChild(div);

    __tickGlobalPoll();

    expect(callback.calls.count()).toBe(1);

    document.body.removeChild(div);
  });

});
