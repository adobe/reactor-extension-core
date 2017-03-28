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
    expect(call.args[0]).toBe(outerElement);
    expect(call.args[1]).toBe(event);
  });
});
