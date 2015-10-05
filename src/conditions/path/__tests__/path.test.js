'use strict';

var mockDocument = {
  location: {
    pathname: '/foo/bar.html',
    search: '?mmm=bacon'
  }
};

var conditionDelegateInjector = require('inject!../path');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  document: mockDocument
});

describe('path condition delegate', function() {
  describe('include', function() {
    it('returns true when the path matches one of the string options', function() {
      var config = { include: ['snowcones.html', '/foo/bar.html?mmm=bacon'] };
      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the path does not match one of the string options', function() {
      var config = { include: ['snowcones.html', 'hotdogs.html?mmm=bacon'] };
      expect(conditionDelegate(config)).toBe(false);
    });

    it('returns true when the path matches one of the regex options', function() {
      var config = { include: ['snowcones.html', /\/foo\/bar.*/i] };
      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the path does not match one of the regex options', function() {
      var config = { include: ['snowcones.html', /\/index.*/i] };
      expect(conditionDelegate(config)).toBe(false);
    });
  });

  describe('exclude', function() {
    it('returns true when the path does not match one of the string options', function() {
      var config = { exclude: ['snowcones.html', 'hotdogs.html?mmm=bacon'] };
      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the path matches one of the string options', function() {
      var config = { exclude: ['snowcones.html', '/foo/bar.html?mmm=bacon'] };
      expect(conditionDelegate(config)).toBe(false);
    });

    it('returns true when the path does not match one of the regex options', function() {
      var config = { exclude: ['snowcones.html', /\/index.*/i] };
      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the path matches one of the regex options', function() {
      var config = { exclude: ['snowcones.html', /\/foo\/bar.*/i] };
      expect(conditionDelegate(config)).toBe(false);
    });
  });

  describe('mixed', function() {
    it('returns true when the path matches an include option and does not match ' +
        'an exclude option', function() {
      var config = {
        include: ['snowcones.html', '/foo/bar.html?mmm=bacon'],
        exclude: ['snowcones.html']
      };

      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the path does not match an include option and does not match ' +
        'an exclude option', function() {
      var config = {
        include: ['snowcones.html', 'biscuits.html?woo=car'],
        exclude: ['my.yahoo.com']
      };

      expect(conditionDelegate(config)).toBe(false);
    });

    it('returns false when the path matches an include option and matches ' +
        'an exclude option', function() {
      var config = {
        include: ['basketball.espn.com', '/foo/bar.html?mmm=bacon'],
        exclude: ['/foo/bar.html?mmm=bacon']
      };

      expect(conditionDelegate(config)).toBe(false);
    });
  });
});
