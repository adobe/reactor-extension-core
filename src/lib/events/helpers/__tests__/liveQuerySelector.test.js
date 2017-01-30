/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

var POLL_INTERVAL = 3000;

describe('liveQuerySelector', function() {
  var liveQuerySelector;

  beforeAll(function() {
    // The module may have been previously required by other another module (namely, hover.js)
    // which prevents us from installing a clock that is effective unless we clear the cache and
    // require the module again.
    delete require.cache[require.resolve('../liveQuerySelector')];

    jasmine.clock().install();
    liveQuerySelector = require('../liveQuerySelector');
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
