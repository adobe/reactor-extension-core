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

describe('change event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var delegate = require('../change');

  var assertTriggerCall = function(options) {
    expect(options.call.args[0]).toBe(options.relatedElement);
    expect(options.call.args[1].type).toBe('change');
    expect(options.call.args[1].target).toBe(options.target);
  };

  describe('without value defined', function() {
    testStandardEvent(delegate, 'change');
  });

  describe('with value defined', function() {
    var outerElement;
    var innerElement;

    beforeAll(function() {
      outerElement = document.createElement('div');
      outerElement.id = 'outer';

      innerElement = document.createElement('input');
      innerElement.setAttribute('type', 'text');
      innerElement.id = 'inner';
      outerElement.appendChild(innerElement);

      document.body.insertBefore(outerElement, document.body.firstChild);
    });

    afterAll(function() {
      document.body.removeChild(outerElement);
    });

    it('triggers rule when a string value matches', function() {
      var trigger = jasmine.createSpy();

      delegate({
        elementSelector: '#outer',
        value: 'foo',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true
      }, trigger);

      innerElement.value = 'foo';
      Simulate.change(innerElement);

      expect(trigger.calls.count()).toBe(1);

      assertTriggerCall({
        call: trigger.calls.mostRecent(),
        target: innerElement,
        relatedElement: outerElement
      });
    });

    it('does not trigger rule when a string value does not match', function() {
      var trigger = jasmine.createSpy();

      delegate({
        elementSelector: '#outer',
        value: 'foo',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true
      }, trigger);

      innerElement.value = 'bar';
      Simulate.change(innerElement);

      expect(trigger.calls.count()).toBe(0);
    });

    it('triggers rule when a regex value matches', function() {
      var trigger = jasmine.createSpy();

      delegate({
        elementSelector: '#outer',
        value: '^F',
        valueIsRegex: true,
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true
      }, trigger);

      innerElement.value = 'foo';
      Simulate.change(innerElement);

      expect(trigger.calls.count()).toBe(1);

      assertTriggerCall({
        call: trigger.calls.mostRecent(),
        target: innerElement,
        relatedElement: outerElement
      });
    });

    it('does not trigger rule when a string value does not match', function() {
      var trigger = jasmine.createSpy();

      delegate({
        elementSelector: '#outer',
        value: '^f',
        valueIsRegex: true,
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true
      }, trigger);

      innerElement.value = 'bar';
      Simulate.change(innerElement);

      expect(trigger.calls.count()).toBe(0);
    });
  });
});
