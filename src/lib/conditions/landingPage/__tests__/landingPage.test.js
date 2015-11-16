'use strict';

var mockVisitorTracking = {
  getLandingPage: function() {
    return 'http://landingpage.com/test.html';
  }
};

var conditionDelegateInjector = require('inject!../landingPage');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')({
  resourceStubs: {
    'dtm.visitorTracking': mockVisitorTracking
  }
});
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  resourceProvider: publicRequire('resourceProvider')
});

var getConfig = function(page) {
  return {
    page: page
  };
};

describe('landing page condition delegate', function() {
  it('returns true when the landing page matches a string', function() {
    var config = getConfig('http://landingpage.com/test.html');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the landing page does not match a string', function() {
    var config = getConfig('http://foo.com/bar.html');
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the landing page matches a regex', function() {
    var config = getConfig(/landingpage\.com\/t.st/i);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the landing page does not match a regex', function() {
    var config = getConfig(/f.o/i);
    expect(conditionDelegate(config)).toBe(false);
  });
});
