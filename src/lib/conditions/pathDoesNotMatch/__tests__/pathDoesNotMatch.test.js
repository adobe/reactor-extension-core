'use strict';

var mockDocument = {
  location: {
    pathname: '/foo/bar.html',
    search: '?mmm=bacon'
  }
};

var conditionDelegateInjector = require('inject!../pathDoesNotMatch');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  document: mockDocument
});

describe('path does not match condition delegate', function() {
  it('returns true when the path does not match an unacceptable string', function() {
    var config = { path: 'hotdogs.html?mmm=bacon' };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the path matches an unacceptable string', function() {
    var config = { path: '/foo/bar.html?mmm=bacon' };
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the path does not match an unacceptable regex', function() {
    var config = { path: /\/index.*/i };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the path matches an unacceptable regex', function() {
    var config = { path: /\/foo\/bar.*/i };
    expect(conditionDelegate(config)).toBe(false);
  });
});
