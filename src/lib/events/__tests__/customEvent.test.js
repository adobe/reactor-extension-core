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

var outerElement;
var innerElement;

var triggerCustomEvent = function(element, type) {
  var event = document.createEvent('Event');
  event.initEvent(type, true, true);
  element.dispatchEvent(event);
  return event;
};

describe('custom event event type', function() {
  var delegate = require('../customEvent');

  beforeAll(function() {
    outerElement = document.createElement('div');
    outerElement.id = 'outer';

    innerElement = document.createElement('div');
    innerElement.id = 'inner';
    outerElement.appendChild(innerElement);

    document.body.insertBefore(outerElement, document.body.firstChild);
  });

  afterAll(function() {
    document.body.removeChild(outerElement);
  });

  it('triggers rule when event occurs', function() {
    var CUSTOM_EVENT_TYPE = 'foo';

    var trigger = jasmine.createSpy();

    delegate({
      elementSelector: '#outer',
      type: CUSTOM_EVENT_TYPE,
      bubbleFireIfParent: true
    }, trigger);

    var event = triggerCustomEvent(innerElement, CUSTOM_EVENT_TYPE);

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    expect(call.args[0]).toEqual({
      element: outerElement,
      target: innerElement,
      nativeEvent: jasmine.any(Object)
    });
  });
});
