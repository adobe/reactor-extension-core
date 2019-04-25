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

var outerElement;
var innerElement;

var assertTriggerCall = function(options) {
  expect(options.call.args[0]).toEqual({
    element: options.element,
    target: options.target,
    nativeEvent: jasmine.any(Object)
  });
};

module.exports = function(getDelegate, type) {
  describe('standard event functionality', function() {
    var delegate;

    beforeEach(function() {
      delegate = getDelegate();

      outerElement = document.createElement('div');
      outerElement.id = 'outer';
      outerElement.title = 'outer container';

      innerElement = document.createElement('div');
      innerElement.id = 'inner';
      innerElement.title = 'inner container';
      outerElement.appendChild(innerElement);

      document.body.insertBefore(outerElement, document.body.firstChild);
    });

    afterEach(function() {
      document.body.removeChild(outerElement);
    });

    var simulateEvent = function() {
      // We're overloading our usage of Simulate here. The second arg is a character which only
      // applies for simulating keyboard events but doesn't really do anything in the case of
      // mouse events.
      Simulate[type](innerElement, 'A');
    };

    it('triggers rule when event occurs with no element refinements', function() {
      var trigger = jasmine.createSpy();

      delegate({
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true
      }, trigger);

      simulateEvent();

      expect(trigger.calls.count()).toBe(1);

      assertTriggerCall({
        call: trigger.calls.mostRecent(),
        type: type,
        target: innerElement,
        element: innerElement
      });
    });

    it('triggers rule when elementSelector matches', function() {
      var trigger = jasmine.createSpy();

      delegate({
        elementSelector: '#outer',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true
      }, trigger);

      simulateEvent();

      expect(trigger.calls.count()).toBe(1);

      assertTriggerCall({
        call: trigger.calls.mostRecent(),
        type: type,
        target: innerElement,
        element: outerElement
      });
    });

    it('does not trigger rule when elementSelector does not match', function() {
      var trigger = jasmine.createSpy();

      delegate({
        elementSelector: '#mismatch',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true
      }, trigger);

      simulateEvent();

      expect(trigger.calls.count()).toBe(0);
    });

    it('triggers rule when elementProperties matches', function() {
      var trigger = jasmine.createSpy();

      delegate({
        elementProperties: [{
          name: 'title',
          value: 'outer container'
        }],
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true
      }, trigger);

      simulateEvent();

      expect(trigger.calls.count()).toBe(1);

      assertTriggerCall({
        call: trigger.calls.mostRecent(),
        type: type,
        target: innerElement,
        element: outerElement
      });
    });

    it('does not trigger rule when elementProperties does not match', function() {
      var trigger = jasmine.createSpy();

      delegate({
        elementProperties: [{
          name: 'title',
          value: 'mismatch container'
        }],
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true
      }, trigger);

      simulateEvent();

      expect(trigger.calls.count()).toBe(0);
    });
  });
};
