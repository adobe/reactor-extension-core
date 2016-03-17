'use strict';

var mockVisitorTracking = {
  getLandingPage: function() {
    return 'http://landingpage.com/test.html';
  },
  enable: jasmine.createSpy()
};

var conditionDelegateInjector = require('inject!../landingPage');
var publicRequire = require('../../__tests__/helpers/stubPublicRequire')({
  helperStubs: {
    'dtm/helpers/visitor-tracking': mockVisitorTracking
  }
});
var conditionDelegate = conditionDelegateInjector({
  'get-extension': publicRequire('get-extension')
});

var getSettings = function(page, pageIsRegex) {
  return {
    page: page,
    pageIsRegex: pageIsRegex
  };
};

describe('landing page condition delegate', function() {
  it('calls visitorTracking.enable', function() {
    expect(mockVisitorTracking.enable).toHaveBeenCalled();
  });

  it('returns true when the landing page matches a string', function() {
    var settings = getSettings('http://landingpage.com/test.html', false);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the landing page does not match a string', function() {
    var settings = getSettings('http://foo.com/bar.html', false);
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the landing page matches a regex', function() {
    var settings = getSettings('Landingpage\\.com\\/t.st', true);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the landing page does not match a regex', function() {
    var settings = getSettings('f.o', true);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
