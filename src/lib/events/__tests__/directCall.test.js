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

describe('directCall event type', function() {
  var delegateInjector = require('inject!../directCall');
  var delegate;

  beforeAll(function() {
    delegate = delegateInjector({
      '@turbine/logger': {
        log: function() {}
      }
    });
  });

  it('triggers rule when _satellite.track() is called with matching name', function() {
    var trigger = jasmine.createSpy();

    delegate({
      name: 'foo'
    }, trigger);

    expect(trigger.calls.count()).toBe(0);

    _satellite.track('foo');

    expect(trigger.calls.count()).toBe(1);

    _satellite.track('bar');

    expect(trigger.calls.count()).toBe(1);
  });
});
