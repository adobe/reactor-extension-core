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
import once from '../once.js';

describe('once', function () {
  it('calls the target function at most a single time', function () {
    const targetFn = jasmine.createSpy();
    const oncified = once(targetFn);

    oncified();

    expect(targetFn.calls.count()).toBe(1);

    oncified();

    expect(targetFn.calls.count()).toBe(1);
  });

  it('calls the target function with the provided context', function () {
    const targetFn = jasmine.createSpy();
    const context = {};
    const oncified = once(targetFn, context);

    oncified();

    expect(targetFn.calls.first().object).toBe(context);
  });

  it('calls the target function with the provided arguments', function () {
    const targetFn = jasmine.createSpy();
    const oncified = once(targetFn);

    oncified('a', 'b');

    expect(targetFn.calls.first().args).toEqual(['a', 'b']);
  });
});
