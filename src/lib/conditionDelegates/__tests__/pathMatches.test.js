'use strict';

var mockDocument = {
  location: {
    pathname: '/foo/bar.html',
    search: '?mmm=bacon'
  }
};

var conditionDelegateInjector = require('inject!../pathMatches');
var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  document: mockDocument
});

describe('path matches condition delegate', function() {
  it('returns true when the path matches an acceptable string', function() {
    var config = {
      paths: [
        {
          value: 'snowcones.html',
        },
        {
          value: '/foo/bar.html?mmm=bacon'
        }
      ]
    };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the path does not match an acceptable string', function() {
    var config = {
      paths: [
        {
          value: 'snowcones.html',
        },
        {
          value: 'hotdogs.html?mmm=bacon'
        }
      ]
    };
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the path matches an acceptable regex', function() {
    var config = {
      paths: [
        {
          value: 'snowcones.html',
        },
        {
          value: '\\/Foo\\/bar.*',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the path does not match an acceptable regex', function() {
    var config = {
      paths: [
        {
          value: 'snowcones.html'
        },
        {
          value: '/index.*',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(config)).toBe(false);
  });
});
