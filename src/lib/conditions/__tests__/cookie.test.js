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
var conditionDelegateInjector = require('inject!../cookie');
var conditionDelegate = conditionDelegateInjector({
  '@turbine/document': {
    cookie: 'test=foo'
  }
});

describe('cookie condition delegate', function() {
  it('returns true when the cookie matches the string value', function() {
    var settings = { name: 'test', value: 'foo' };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the cookie does not match the string value', function() {
    var settings = { name: 'test', value: 'cake' };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the cookie matches the regex value', function() {
    var settings = { name: 'test', value: 'F.o', valueIsRegex: true };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the cookie does not match the regex value', function() {
    var settings = { name: 'test', value: 'g.o', valueIsRegex: true };
    expect(conditionDelegate(settings)).toBe(false);
  });
});
