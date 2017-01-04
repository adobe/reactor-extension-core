'use strict';

var mockDocument = {
  location: {
    pathname: '/foo/bar.html',
    search: '?mmm=bacon'
  }
};

var conditionDelegateInjector = require('inject!../path');
var conditionDelegate = conditionDelegateInjector({
  '@turbine/document': mockDocument
});

describe('path condition delegate', function() {
  it('returns true when the path matches an acceptable string', function() {
    var settings = {
      paths: [
        {
          value: 'snowcones.html'
        },
        {
          value: '/foo/bar.html?mmm=bacon'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the path does not match an acceptable string', function() {
    var settings = {
      paths: [
        {
          value: 'snowcones.html'
        },
        {
          value: 'hotdogs.html?mmm=bacon'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the path matches an acceptable regex', function() {
    var settings = {
      paths: [
        {
          value: 'snowcones.html'
        },
        {
          value: '\\/Foo\\/bar.*',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the path does not match an acceptable regex', function() {
    var settings = {
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
    expect(conditionDelegate(settings)).toBe(false);
  });
});
