'use strict';

var mockDocument = {
  location: {
    hostname: 'foo.adobe.com'
  }
};

var conditionDelegateInjector = require('inject!../subdomainMatches');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  document: mockDocument
});

describe('subdomain matches condition delegate', function() {
  it('returns true when the subdomain matches an acceptable string', function() {
    var config = {
      subdomains: [
        {
          value: 'basketball.espn.com'
        },
        {
          value: 'foo.adobe.com'
        }
      ]
    };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the subdomain does not match an acceptable string', function() {
    var config = {
      subdomains: [
        {
          value: 'basketball.espn.com'
        },
        {
          value: 'my.yahoo.com'
        }
      ]
    };
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the subdomain matches an acceptable regex', function() {
    var config = {
      subdomains: [
        {
          value: 'basketball.espn.com'
        },
        {
          value: 'f.o\\.adobe\\.com',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the subdomain does not match an acceptable regex', function() {
    var config = {
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
    expect(conditionDelegate(config)).toBe(false);
  });
});
