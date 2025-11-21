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

import { injectDebounce } from '../debounce.js';
import { vi } from 'vitest';
const debounce = injectDebounce({ window });

describe('debounce', function () {
  beforeAll(function () {
    vi.useFakeTimers();
  });

  afterAll(function () {
    vi.useRealTimers();
  });

  it('calls the target function once after delay', function () {
    const targetFn = vi.fn();
    const debouncedFn = debounce(targetFn, 100);

    debouncedFn();

    expect(targetFn.mock.calls.length).toBe(0);

    vi.advanceTimersByTime(60);

    debouncedFn();

    vi.advanceTimersByTime(60);

    expect(targetFn.mock.calls.length).toBe(0);

    vi.advanceTimersByTime(40);

    expect(targetFn.mock.calls.length).toBe(1);
  });

  it('calls the target function using the provided context', function () {
    const targetFn = vi.fn();
    const context = {};

    debounce(targetFn, 100, context)();

    vi.advanceTimersByTime(100);

    expect(targetFn.mock.calls[0].object).toBe(context);
  });

  it('calls the target function using the provided arguments', function () {
    const targetFn = vi.fn();

    debounce(targetFn, 100)('arg1', 'arg2');

    vi.advanceTimersByTime(100);

    expect(targetFn.mock.calls[0].args).toEqual(['arg1', 'arg2']);
  });
});
