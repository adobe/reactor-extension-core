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

var conditionDelegate = require('../protocol');

var getSettings = function(protocol) {
  return {
    protocol: protocol
  };
};

describe('protocol condition delegate', function() {
  it('returns true when the browser protocol matches', function() {
    var settings = getSettings('http:');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the browser protocol does not match', function() {
    var settings = getSettings('javascript:');
    expect(conditionDelegate(settings)).toBe(false);
  });
});
