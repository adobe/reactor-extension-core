'use strict';

describe('change event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../change');
  var delegate = delegateInjector({
    'get-extension': publicRequire('get-extension')
  });

  var assertTriggerCall = function(options) {
    expect(options.call.args[0].type).toBe('change');
    expect(options.call.args[0].target).toBe(options.target);
    expect(options.call.args[1]).toBe(options.relatedElement);
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
