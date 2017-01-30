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

var mockDocument = {
  location: {
    hostname: 'foo.adobe.com'
  }
};

var conditionDelegateInjector = require('inject!../subdomain');
var conditionDelegate = conditionDelegateInjector({
  '@turbine/document': mockDocument
});

describe('subdomain condition delegate', function() {
  it('returns true when the subdomain matches an acceptable string', function() {
    var settings = {
      subdomains: [
        {
          value: 'basketball.espn.com'
        },
        {
          value: 'foo.adobe.com'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the subdomain does not match an acceptable string', function() {
    var settings = {
      subdomains: [
        {
          value: 'basketball.espn.com'
        },
        {
          value: 'my.yahoo.com'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the subdomain matches an acceptable regex', function() {
    var settings = {
      subdomains: [
        {
          value: 'basketball.espn.com'
        },
        {
          value: 'f.o\\.Adobe\\.com',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the subdomain does not match an acceptable regex', function() {
    var settings = {
      subdomains: [
        {
          value: 'basketball.espn.com'
        },
        {
          value: '/my\\.yahoo\\.com',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(false);
  });
});
