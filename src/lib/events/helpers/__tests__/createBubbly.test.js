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

/*eslint max-len:0*/

describe('createBubbly', function () {
  var createBubbly = require('../createBubbly');

  var aElement;
  var bElement;
  var cElement;

  var createElements = function () {
    aElement = document.createElement('div');
    aElement.innerHTML = 'A';
    aElement.id = 'a';

    bElement = document.createElement('div');
    bElement.innerHTML = 'B';
    bElement.id = 'b';
    aElement.appendChild(bElement);

    cElement = document.createElement('div');
    cElement.innerHTML = 'C';
    cElement.id = 'c';
    bElement.appendChild(cElement);

    document.body.appendChild(aElement);
  };

  var removeElements = function () {
    document.body.removeChild(aElement);
    aElement = null;
    bElement = null;
    cElement = null;
  };

  beforeEach(function () {
    createElements();
  });

  afterEach(function () {
    removeElements();
  });

  it('handles a plethora of scenarios', function () {
    var testScenario = function (options) {
      var bubbly = createBubbly();
      var aCallback = jasmine.createSpy();
      var bCallback = jasmine.createSpy();
      var cCallback = jasmine.createSpy();

      bubbly.addListener(
        {
          elementSelector: '#a',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        aCallback
      );

      bubbly.addListener(
        {
          elementSelector: '#b',
          bubbleFireIfParent: options.bubbleFireIfParent,
          bubbleFireIfChildFired: options.bubbleFireIfChildFired,
          bubbleStop: options.bubbleStop
        },
        bCallback
      );

      bubbly.addListener(
        {
          elementSelector: '#c',
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true,
          bubbleStop: false
        },
        cCallback
      );

      bubbly.evaluateEvent({
        target: cElement
      });

      expect(aCallback.calls.count()).toBe(options.aExecuted ? 1 : 0);
      expect(bCallback.calls.count()).toBe(options.bExecuted ? 1 : 0);
      expect(cCallback.calls.count()).toBe(options.cExecuted ? 1 : 0);
    };

    var scenarios = [
      //    Given element A contains element B and element B contains element C
      //    Given rule A targets element A with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule B targets element B with:
      //      "Allow events on child elements to bubble"               not checked (bubbleFireIfParent = false)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule C targets element C with:
      //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    The user clicks on element C then
      //      Rule A will be                                           processed
      //      Rule B will be                                           not processed
      //      Rule C will be                                           processed
      {
        bubbleFireIfParent: false,
        bubbleFireIfChildFired: true,
        bubbleStop: false,
        aExecuted: true,
        bExecuted: false,
        cExecuted: true
      },
      //    Given element A contains element B and element B contains element C
      //    Given rule A targets element A with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule B targets element B with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule C targets element C with:
      //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    The user clicks on element C then
      //      Rule A will be                                           processed
      //      Rule B will be                                           processed
      //      Rule C will be                                           processed
      {
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: false,
        aExecuted: true,
        bExecuted: true,
        cExecuted: true
      },
      //    Given element A contains element B and element B contains element C
      //    Given rule A targets element A with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule B targets element B with:
      //      "Allow events on child elements to bubble"               not checked (bubbleFireIfParent = false)
      //      "Don't allow if child element already triggers event"    checked (bubbleFireIfChildFired = false)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule C targets element C with:
      //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    The user clicks on element C then
      //      Rule A will be                                           processed
      //      Rule B will be                                           not processed
      //      Rule C will be                                           processed
      {
        bubbleFireIfParent: false,
        bubbleFireIfChildFired: false,
        bubbleStop: false,
        aExecuted: true,
        bExecuted: false,
        cExecuted: true
      },
      //    Given element A contains element B and element B contains element C
      //    Given rule A targets element A with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule B targets element B with:
      //      "Allow events on child elements to bubble"               not checked (bubbleFireIfParent = false)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        checked (bubbleStop = true)
      //    Given rule C targets element C with:
      //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    The user clicks on element C then
      //      Rule A will be                                           processed
      //      Rule B will be                                           not processed
      //      Rule C will be                                           processed
      {
        bubbleFireIfParent: false,
        bubbleFireIfChildFired: true,
        bubbleStop: true,
        aExecuted: true,
        bExecuted: false,
        cExecuted: true
      },
      //    Given element A contains element B and element B contains element C
      //    Given rule A targets element A with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule B targets element B with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    checked (bubbleFireIfChildFired = false)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule C targets element C with:
      //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    The user clicks on element C then
      //      Rule A will be                                           processed
      //      Rule B will be                                           not processed
      //      Rule C will be                                           processed
      {
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: false,
        bubbleStop: false,
        aExecuted: true,
        bExecuted: false,
        cExecuted: true
      },
      //    Given element A contains element B and element B contains element C
      //    Given rule A targets element A with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule B targets element B with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        checked (bubbleStop = true)
      //    Given rule C targets element C with:
      //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    The user clicks on element C then
      //      Rule A will be                                           not processed
      //      Rule B will be                                           processed
      //      Rule C will be                                           processed
      {
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        bubbleStop: true,
        aExecuted: false,
        bExecuted: true,
        cExecuted: true
      },
      //    Given element A contains element B and element B contains element C
      //    Given rule A targets element A with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule B targets element B with:
      //      "Allow events on child elements to bubble"               not checked (bubbleFireIfParent = false)
      //      "Don't allow if child element already triggers event"    checked (bubbleFireIfChildFired = false)
      //      "Don't allow events to bubble upwards to parents"        checked (bubbleStop = true)
      //    Given rule C targets element C with:
      //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    The user clicks on element C then
      //      Rule A will be                                           processed
      //      Rule B will be                                           not processed
      //      Rule C will be                                           processed
      {
        bubbleFireIfParent: false,
        bubbleFireIfChildFired: false,
        bubbleStop: true,
        aExecuted: true,
        bExecuted: false,
        cExecuted: true
      },
      //    Given element A contains element B and element B contains element C
      //    Given rule A targets element A with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule B targets element B with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    checked (bubbleFireIfChildFired = false)
      //      "Don't allow events to bubble upwards to parents"        checked (bubbleStop = true)
      //    Given rule C targets element C with:
      //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    The user clicks on element C then
      //      Rule A will be                                           processed
      //      Rule B will be                                           not processed
      //      Rule C will be                                           processed
      {
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: false,
        bubbleStop: true,
        aExecuted: true,
        bExecuted: false,
        cExecuted: true
      },
      //    Given element A contains element B and element B contains element C
      //    Given rule A targets element A with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    Given rule B targets element B with:
      //      "Allow events on child elements to bubble"               checked (bubbleFireIfParent = undefined)
      //      "Don't allow if child element already triggers event"    checked (bubbleFireIfChildFired = undefined)
      //      "Don't allow events to bubble upwards to parents"        checked (bubbleStop = undefined)
      //    Given rule C targets element C with:
      //      "Allow events on child elements to bubble"               checked  (bubbleFireIfParent = true)
      //      "Don't allow if child element already triggers event"    not checked (bubbleFireIfChildFired = true)
      //      "Don't allow events to bubble upwards to parents"        not checked (bubbleStop = false)
      //    The user clicks on element C then
      //      Rule A will be                                           processed
      //      Rule B will be                                           processed
      //      Rule C will be                                           processed
      {
        bubbleFireIfParent: undefined,
        bubbleFireIfChildFired: undefined,
        bubbleStop: undefined,
        aExecuted: true,
        bExecuted: true,
        cExecuted: true
      }
    ];

    scenarios.forEach(testScenario);
  });

  it('considers a rule not triggered when the listener callback returns false', function () {
    var bubbly = createBubbly();
    var aCallback = jasmine.createSpy();
    var bCallback = jasmine.createSpy().and.returnValue(false);

    bubbly.addListener(
      {
        elementSelector: '#a',
        bubbleFireIfParent: true,
        // This would typically prevent aCallback from being executed, but since the bCallback
        // returned false that means b's rule didn't execute, which allows a's rule to execute.
        bubbleFireIfChildFired: false,
        bubbleStop: false
      },
      aCallback
    );

    bubbly.addListener(
      {
        elementSelector: '#b',
        bubbleFireIfParent: true,
        bubbleFireIfChildFired: true,
        // This would typically prevent aCallback from being executed, but since the bCallback
        // returned false that means b's rule didn't execute, which allows a's rule to execute.
        bubbleStop: true
      },
      bCallback
    );

    bubbly.evaluateEvent({
      target: bElement
    });

    expect(aCallback.calls.count()).toBe(1);
    expect(bCallback.calls.count()).toBe(1);
  });

  it('calls the callback when the element matches elementProperties w/ string value', function () {
    var bubbly = createBubbly();
    var callback = jasmine.createSpy();

    bubbly.addListener(
      {
        elementProperties: [
          {
            name: 'innerHTML',
            value: 'C'
          }
        ]
      },
      callback
    );

    bubbly.evaluateEvent({
      target: cElement
    });

    expect(callback.calls.count()).toBe(1);
  });

  it(
    'does not call the callback when the element does not match elementProperties ' +
      'w/ string value',
    function () {
      var bubbly = createBubbly();
      var callback = jasmine.createSpy();

      bubbly.addListener(
        {
          elementProperties: [
            {
              name: 'innerHTML',
              value: 'no match'
            }
          ]
        },
        callback
      );

      bubbly.evaluateEvent({
        target: cElement
      });

      expect(callback.calls.count()).toBe(0);
    }
  );

  it('calls the callback when the element matches elementProperties w/ regex value', function () {
    var bubbly = createBubbly();
    var callback = jasmine.createSpy();

    bubbly.addListener(
      {
        elementProperties: [
          {
            name: 'innerHTML',
            value: '^C$',
            valueIsRegex: true
          }
        ]
      },
      callback
    );

    bubbly.evaluateEvent({
      target: cElement
    });

    expect(callback.calls.count()).toBe(1);
  });

  it(
    'does not call the callback when the element does not match elementProperties ' +
      'w/ regex value',
    function () {
      var bubbly = createBubbly();
      var callback = jasmine.createSpy();

      bubbly.addListener(
        {
          elementProperties: [
            {
              name: 'innerHTML',
              value: '^abc$',
              valueIsRegex: true
            }
          ]
        },
        callback
      );

      bubbly.evaluateEvent({
        target: cElement
      });

      expect(callback.calls.count()).toBe(0);
    }
  );

  it('passes a synthetic event to the callback with attached native event', function () {
    var bubbly = createBubbly();
    var callback = jasmine.createSpy();

    bubbly.addListener(
      {
        elementSelector: '#a'
      },
      callback
    );

    var nativeEvent = {
      target: cElement
    };

    bubbly.evaluateEvent(nativeEvent);

    expect(callback.calls.mostRecent().args[0]).toEqual({
      element: aElement,
      target: cElement,
      nativeEvent: nativeEvent
    });
  });

  it('passes a synthetic event to the callback with data from passed synthetic event', function () {
    var bubbly = createBubbly();
    var callback = jasmine.createSpy();

    bubbly.addListener(
      {
        elementSelector: '#a'
      },
      callback
    );

    var nativeEvent = {
      target: cElement,
      foo: 'bar'
    };

    bubbly.evaluateEvent(nativeEvent, true);

    expect(callback.calls.mostRecent().args[0]).toEqual({
      element: aElement,
      target: cElement,
      foo: 'bar'
    });
  });

  describe('when no element refinements are specified', function () {
    it('calls the callback once if the target is a nested element', function () {
      var bubbly = createBubbly();
      var callback = jasmine.createSpy();

      bubbly.addListener({}, callback);

      bubbly.evaluateEvent({
        target: cElement
      });

      expect(callback.calls.count()).toBe(1);
    });

    it('calls the callback once if the target is document', function () {
      var bubbly = createBubbly();
      var callback = jasmine.createSpy();

      bubbly.addListener({}, callback);

      bubbly.evaluateEvent({
        target: document
      });

      expect(callback.calls.count()).toBe(1);
    });
  });
});
