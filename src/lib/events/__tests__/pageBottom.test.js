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

var injector = require('inject!../pageBottom');

describe('pageBottom event type', function() {
  it('triggers rule at the bottom of the page', function() {
    var fakeDocument;

    fakeDocument = {
      location: 'http://somelocation.com'
    };

    var triggerPageBottom;
    var onPageBottom = function(callback) {
      triggerPageBottom = callback;
    };

    var delegate = injector({
      '@turbine/document': fakeDocument,
      '@turbine/on-page-bottom': onPageBottom
    });

    var trigger = jasmine.createSpy();
    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(0);

    triggerPageBottom();

    expect(trigger.calls.count()).toBe(1);

    var call = trigger.calls.mostRecent();
    expect(call.args[0]).toBe('http://somelocation.com');
    expect(call.args[1].type).toBe('pagebottom');
    expect(call.args[1].target).toBe('http://somelocation.com');
  });
});
