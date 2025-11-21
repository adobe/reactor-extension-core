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

import { injectLiveQuerySelector } from '../liveQuerySelector.js';
import WeakMap from '../weakMap.js';
import { vi } from 'vitest';
const { liveQuerySelector, __reset } = injectLiveQuerySelector({ WeakMap });

const POLL_INTERVAL = 3000;

describe('liveQuerySelector', function () {
  beforeAll(function () {
    jasmine.clock().install();
  });

  afterAll(function () {
    jasmine.clock().uninstall();
    if (__reset) {
      __reset();
    }
  });

  it('detects an element added before polling starts', function () {
    const div = document.createElement('div');
    div.className = 'foo';
    document.body.appendChild(div);

    const callback = vi.fn();
    liveQuerySelector('.foo', callback);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback.mock.calls.length).toBe(1);

    document.body.removeChild(div);
  });

  it('detects an element added after polling starts', function () {
    // Polling doesn't start until liveQuerySelector is called once.
    liveQuerySelector('a', function () {});
    jasmine.clock().tick(5000);

    const div = document.createElement('div');
    div.className = 'foo';
    document.body.appendChild(div);

    const callback = vi.fn();
    liveQuerySelector('.foo', callback);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback.mock.calls.length).toBe(1);

    document.body.removeChild(div);
  });

  it('calls a callback twice when two elements exist that match the selector', function () {
    const div = document.createElement('div');
    div.className = 'foo';
    document.body.appendChild(div);

    const a = document.createElement('a');
    a.className = 'foo';
    div.appendChild(a);

    const callback = vi.fn();
    liveQuerySelector('.foo', callback);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback.mock.calls.length).toBe(2);

    document.body.removeChild(div);
  });

  it('calls two callbacks targeting the same element', function () {
    const div = document.createElement('div');
    div.className = 'foo';
    document.body.appendChild(div);

    const callback1 = vi.fn();
    liveQuerySelector('.foo', callback1);

    const callback2 = vi.fn();
    liveQuerySelector('.foo', callback2);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback1.mock.calls.length).toBe(1);
    expect(callback2.mock.calls.length).toBe(1);

    document.body.removeChild(div);
  });

  it('does not call the same callback again if the element is re-added', function () {
    const div = document.createElement('div');
    div.className = 'foo';
    document.body.appendChild(div);

    const callback = vi.fn();
    liveQuerySelector('.foo', callback);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback.mock.calls.length).toBe(1);

    document.body.removeChild(div);

    jasmine.clock().tick(POLL_INTERVAL);

    document.body.appendChild(div);

    jasmine.clock().tick(POLL_INTERVAL);

    expect(callback.mock.calls.length).toBe(1);

    document.body.removeChild(div);
  });
});
