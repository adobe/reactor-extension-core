/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

var POLL_INTERVAL = 3000;

describe('liveQuerySelector', function () {
  var liveQuerySelector;

  beforeAll(function () {
    // The module may have been previously required by other another module (namely, hover.js)
    // which prevents us from installing a clock that is effective unless we clear the cache and
    // require the module again.
    delete require.cache[require.resolve('../liveQuerySelector')];

    jasmine.clock().install();
    liveQuerySelector = require('../liveQuerySelector');
  });

  afterAll(function () {
    jasmine.clock().uninstall();
  });

  it('detects an element added before polling starts', function () {
    var div = document.createElement('div');
    div.className = 'foo';
    document.body.appendChild(div);

    var callback = jasmine.createSpy();
    liveQuerySelector('.foo', callback);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback.calls.count()).toBe(1);

    document.body.removeChild(div);
  });

  it('detects an element added after polling starts', function () {
    // Polling doesn't start until liveQuerySelector is called once.
    liveQuerySelector('a', function () {});
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

  it('calls a callback twice when two elements exist that match the selector', function () {
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

  it('calls two callbacks targeting the same element', function () {
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

  it('does not call the same callback again if the element is re-added', function () {
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
