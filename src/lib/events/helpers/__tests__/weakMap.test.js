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

describe('WeakMap', function() {
  it('returns the native WeakMap if it exists', function() {
    var MockWeakMap = function() {};
    var mockWindow = {
      WeakMap: MockWeakMap
    };

    var WeakMap = require('inject-loader!../weakMap')({
      '@adobe/reactor-window': mockWindow
    });

    expect(WeakMap).toBe(MockWeakMap);
  });

  it('returns WeakMap implementation without modifying global scope', function() {
    var mockWindow = {};

    var WeakMap = require('inject-loader!../weakMap')({
      '@adobe/reactor-window': mockWindow
    });

    expect(WeakMap).toEqual(jasmine.any(Function));
    expect(mockWindow.WeakMap).toBeUndefined();
  });

  // Tests below are derived from
  // https://github.com/webcomponents/webcomponentsjs/blob/82964dec42a7f6af70142b1bbf3bc4ca16bf1bcf/tests/WeakMap/tests.html

  it('has get, set, delete, and has functions', function() {
    var WeakMap = require('inject-loader!../weakMap')({
      // Inject an empty window so we don't end up testing the native WeakMap if it exists
      // in the target browser.
      '@adobe/reactor-window': {}
    });
    expect(WeakMap.prototype.get).toEqual(jasmine.any(Function));
    expect(WeakMap.prototype.set).toEqual(jasmine.any(Function));
    expect(WeakMap.prototype.delete).toEqual(jasmine.any(Function));
    expect(WeakMap.prototype.has).toEqual(jasmine.any(Function));
  });

  it('has methods that perform as expected', function() {
    var WeakMap = require('inject-loader!../weakMap')({
      // Inject an empty window so we don't end up testing the native WeakMap if it exists
      // in the target browser.
      '@adobe/reactor-window': {}
    });
    var wm = new WeakMap();

    var o1 = {};
    var o2 = function() {};
    var o3 = window;

    // IE 11 WeakMap does not chain
    if (wm.name || !/Trident/.test(navigator.userAgent)) {
      wm.set(o1, 37).set(o2, 'aoeui');
    } else {
      wm.set(o1, 37);
      wm.set(o2, 'aoeui');
    }

    expect(wm.get(o1)).toBe(37);
    expect(wm.get(o2)).toBe('aoeui');

    wm.set(o1, o2);
    wm.set(o3, undefined);

    expect(wm.get(o1)).toBe(o2);
    // `wm.get({})` should return undefined, because there is no value for
    // the object on wm
    expect(wm.get({})).toBeUndefined();
    // `wm.get(o3)` should return undefined, because that is the set value
    expect(wm.get(o3)).toBeUndefined();

    expect(wm.has(o1)).toBe(true);
    expect(wm.has({})).toBe(false);

    wm.delete(o1);
    expect(wm.get(o1)).toBeUndefined();
    expect(wm.has(o1)).toBe(false);
    // Ensure that delete returns true/false indicating if the value was removed
    expect(wm.delete(o2)).toBe(true);
    expect(wm.delete({})).toBe(false);
  });
});
