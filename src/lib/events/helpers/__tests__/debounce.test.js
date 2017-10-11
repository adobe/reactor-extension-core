/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
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

describe('debounce', function() {
  var debounce;

  beforeAll(function() {
    debounce = require('../debounce');
    jasmine.clock().install();
  });

  afterAll(function() {
    jasmine.clock().uninstall();
  });

  it('calls the target function once after delay', function() {
    var targetFn = jasmine.createSpy();
    var debouncedFn = debounce(targetFn, 100);

    debouncedFn();

    expect(targetFn.calls.count()).toBe(0);

    jasmine.clock().tick(60);

    debouncedFn();

    jasmine.clock().tick(60);

    expect(targetFn.calls.count()).toBe(0);

    jasmine.clock().tick(40);

    expect(targetFn.calls.count()).toBe(1);
  });

  it('calls the target function using the provided context', function() {
    var targetFn = jasmine.createSpy();
    var context = {};

    debounce(targetFn, 100, context)();

    jasmine.clock().tick(100);

    expect(targetFn.calls.first().object).toBe(context);
  });

  it('calls the target function using the provided arguments', function() {
    var targetFn = jasmine.createSpy();

    debounce(targetFn, 100)('arg1', 'arg2');

    jasmine.clock().tick(100);

    expect(targetFn.calls.first().args).toEqual(['arg1', 'arg2']);
  });
});
