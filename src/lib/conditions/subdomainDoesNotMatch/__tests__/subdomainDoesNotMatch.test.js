'use strict';

var mockDocument = {
  location: {
    hostname: 'foo.adobe.com'
  }
};

var conditionDelegateInjector = require('inject!../subdomainDoesNotMatch');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  document: mockDocument
});

describe('subdomain does not match condition delegate', function() {
  it('returns true when the subdomain does not match an unacceptable string', function() {
    var config = { subdomain: 'basketball.espn.com' };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the subdomain matches an unacceptable string', function() {
    var config = { subdomain: 'foo.adobe.com' };
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the subdomain does not match an unacceptable regex', function() {
    var config = { subdomain: 'my\\.yahoo\\.com', subdomainIsRegex: true };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the subdomain matches an unacceptable regex', function() {
    var config = { subdomain: 'f.o\\.adobe\\.com', subdomainIsRegex: true };
    expect(conditionDelegate(config)).toBe(false);
  });
});
