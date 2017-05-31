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

describe('onload event type', function() {
  it('triggers rule when the load event occurs', function() {
    var delegate = require('../onLoad');

    var trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(0);

    Simulate.event(window, 'load');

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    expect(call.args.length).toBe(0);
  });
});
