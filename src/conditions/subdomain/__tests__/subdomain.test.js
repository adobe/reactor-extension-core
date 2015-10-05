'use strict';

var mockDocument = {
  location: {
    hostname: 'foo.adobe.com'
  }
};

var conditionDelegateInjector = require('inject!../subdomain');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  document: mockDocument
});

describe('subdomain condition delegate', function() {
  describe('include', function() {
    it('returns true when the subdomain matches one of the string options', function() {
      var config = { include: ['basketball.espn.com', 'foo.adobe.com'] };
      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the subdomain does not match one of the string options', function() {
      var config = { include: ['basketball.espn.com', 'my.yahoo.com'] };
      expect(conditionDelegate(config)).toBe(false);
    });

    it('returns true when the subdomain matches one of the regex options', function() {
      var config = { include: ['basketball.espn.com', /f.o\.adobe\.com/i] };
      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the subdomain does not match one of the regex options', function() {
      var config = { include: ['basketball.espn.com', /my\.yahoo\.com/i] };
      expect(conditionDelegate(config)).toBe(false);
    });
  });

  describe('exclude', function() {
    it('returns true when the subdomain does not match one of the string options', function() {
      var config = { exclude: ['basketball.espn.com', 'my.yahoo.com'] };
      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the subdomain matches one of the string options', function() {
      var config = { exclude: ['basketball.espn.com', 'foo.adobe.com'] };
      expect(conditionDelegate(config)).toBe(false);
    });

    it('returns true when the subdomain does not match one of the regex options', function() {
      var config = { exclude: ['basketball.espn.com', /my\.yahoo\.com/i] };
      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the subdomain matches one of the regex options', function() {
      var config = { exclude: ['basketball.espn.com', /f.o\.adobe\.com/i] };
      expect(conditionDelegate(config)).toBe(false);
    });
  });

  describe('mixed', function() {
    it('returns true when the subdomain matches an include option and does not match ' +
        'an exclude option', function() {
      var config = {
        include: ['basketball.espn.com', 'foo.adobe.com'],
        exclude: ['my.yahoo.com']
      };

      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the subdomain does not match an include option and does not match ' +
        'an exclude option', function() {
      var config = {
        include: ['basketball.espn.com', 'bar.adobe.com'],
        exclude: ['my.yahoo.com']
      };

      expect(conditionDelegate(config)).toBe(false);
    });

    it('returns false when the subdomain matches an include option and matches ' +
        'an exclude option', function() {
      var config = {
        include: ['basketball.espn.com', 'foo.adobe.com'],
        exclude: ['foo.adobe.com']
      };

      expect(conditionDelegate(config)).toBe(false);
    });
  });
});
