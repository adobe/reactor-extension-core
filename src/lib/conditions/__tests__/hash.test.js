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

var conditionDelegate = require('../hash');

describe('hash condition delegate', function() {

  beforeAll(function() {
    document.location.hash = 'hashtest';
  });

  afterAll(function() {
    document.location.hash = '';
  });

  it('returns true when the hash matches an acceptable string', function() {
    var settings = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: '#hashtest'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the hash does not match an acceptable string', function() {
    var settings = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: '#goo'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the hash matches an acceptable regex', function() {
    var settings = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: 'Has.test',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the hash does not match an acceptable regex', function() {
    var settings = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: '#g.o',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(false);
  });
});
