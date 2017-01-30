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

describe('matchesProperties', function() {
  var matchesProperties = require('../matchesProperties');
  var element;
  
  beforeAll(function() {
    element = document.createElement('div');
    element.className = 'flashy';
    element.innerHTML = 'scooter';
  });
  
  it('returns true if the string property value matches', function() {
    var matches = matchesProperties(element, [
      {
        name: 'className',
        value: 'flashy'
      },
      {
        name: 'innerHTML',
        value: 'scooter'
      }
    ]);

    expect(matches).toBe(true);
  });

  it('returns true if the string property value does not match', function() {
    var matches = matchesProperties(element, [
      {
        name: 'className',
        value: 'flashy'
      },
      {
        name: 'innerHTML',
        value: 'hot rod'
      }
    ]);

    expect(matches).toBe(false);
  });

  it('returns true if the regex property value matches', function() {
    var matches = matchesProperties(element, [
      {
        name: 'className',
        value: 'flashy'
      },
      {
        name: 'innerHTML',
        value: 'scoot..',
        valueIsRegex: true
      }
    ]);

    expect(matches).toBe(true);
  });

  it('returns false if the regex property value does not match', function() {
    var matches = matchesProperties(element, [
      {
        name: 'className',
        value: 'flashy'
      },
      {
        name: 'innerHTML',
        value: 'hot r..',
        valueIsRegex: true
      }
    ]);

    expect(matches).toBe(false);
  });
});
