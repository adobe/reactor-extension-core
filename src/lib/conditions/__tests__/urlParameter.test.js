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

var conditionDelegate = require('inject!../urlParameter')({
  '@turbine/get-query-param': function() {
    return 'foo';
  }
});

var getSettings = function(name, value, valueIsRegex) {
  return {
    name: name,
    value: value,
    valueIsRegex: valueIsRegex
  };
};

describe('url parameter condition delegate', function() {
  it('returns true when value matches using regular string', function() {
    var settings = getSettings('testParam', 'foo', false);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when value does not match using regular string', function() {
    var settings = getSettings('testParam', 'goo', false);
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when value matches using regex', function() {
    var settings = getSettings('testParam', '^F[ojd]o$', true);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when value does not match using regex', function() {
    var settings = getSettings('testParam', '^g[ojd]o$', true);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
