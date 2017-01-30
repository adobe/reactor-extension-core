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

var assertTriggerCall = function(options) {
  expect(options.call.args[0]).toBe(document);
  expect(options.call.args[1].type).toBe('zoomchange');
  expect(options.call.args[1].target).toBe(document);
  expect(options.call.args[1].method).toBe(options.method);
  expect(options.call.args[1].zoom).toBe(options.zoom);
};

describe('zoomchange event type', function() {
  var delegate;
  var mockWindow = {
    ongestureend: null,
    ontouchend: null
  };

  beforeAll(function() {
    jasmine.clock().install();
    jasmine.clock().mockDate();

    var delegateInjector = require('inject!../zoomChange');
    delegate = delegateInjector({
      '@turbine/window': mockWindow,
    });
  });

  afterAll(function() {
    jasmine.clock().uninstall();
  });

  it('triggers rule when zoom changes', function() {
    var trigger = jasmine.createSpy();

    mockWindow.innerWidth = document.documentElement.clientWidth;

    delegate({}, trigger);

    Simulate.event(document, 'gestureend');

    mockWindow.innerWidth = document.documentElement.clientWidth / 1.5;

    expect(trigger.calls.count()).toEqual(0);

    jasmine.clock().tick(1049);

    expect(trigger.calls.count()).toEqual(0);

    jasmine.clock().tick(1);

    expect(trigger.calls.count()).toEqual(1);
    assertTriggerCall({
      call: trigger.calls.mostRecent(),
      method: 'pinch',
      zoom: '1.50'
    });

    Simulate.event(document, 'touchend');
    mockWindow.innerWidth = document.documentElement.clientWidth / 2;

    jasmine.clock().tick(1249);

    expect(trigger.calls.count()).toEqual(1);

    jasmine.clock().tick(1);

    expect(trigger.calls.count()).toEqual(2);
    assertTriggerCall({
      call: trigger.calls.mostRecent(),
      method: 'double tap',
      zoom: '2.00'
    });
  });
});
