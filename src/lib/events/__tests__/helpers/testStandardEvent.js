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

var outerElement;
var innerElement;

var assertTriggerCall = function(options) {
  expect(options.call.args[0]).toBe(options.relatedElement);
  expect(options.call.args[1].type).toBe(options.type);
  expect(options.call.args[1].target).toBe(options.target);
};

module.exports = function(delegate, type) {
  beforeAll(function() {
    outerElement = document.createElement('div');
    outerElement.id = 'outer';
    outerElement.title = 'outer container';

    innerElement = document.createElement('div');
    innerElement.id = 'inner';
    innerElement.title = 'inner container';
    outerElement.appendChild(innerElement);

    document.body.insertBefore(outerElement, document.body.firstChild);
  });

  afterAll(function() {
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
      relatedElement: innerElement
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
      relatedElement: outerElement
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
      relatedElement: outerElement
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
};
