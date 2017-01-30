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

var matcher = require('../textMatch');

describe('text-match', function() {
  it('returns true if string is an exact match', function() {
    expect(matcher('This is My House', 'This is My House')).toBe(true);
  });

  it('returns false if string is not an exact match', function() {
    expect(matcher('This is My House', 'This is NOT My House')).toBe(false);
  });

  it('returns true if the regex matches', function() {
    expect(matcher('This is NOT my House', /^T/)).toBe(true);
  });

  it('returns false if the regex does not match', function() {
    expect(matcher('This is NOT my House', /^Z/)).toBe(false);
  });

  it('returns false if the string is null', function() {
    expect(matcher(null, 'Something')).toBe(false);
  });

  it('Throws an Illegal Argument error message if the pattern is not defined', function() {
    var errorThrower = function() {
      matcher('This is My House');
    };
    expect(errorThrower).toThrowError('Illegal Argument: Pattern is not present');
  });
});
