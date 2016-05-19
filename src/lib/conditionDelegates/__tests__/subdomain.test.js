'use strict';

var mockDocument = {
  location: {
    hostname: 'foo.adobe.com'
  }
};

var conditionDelegateInjector = require('inject!../subdomain');
var conditionDelegate = conditionDelegateInjector({
  document: mockDocument
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
