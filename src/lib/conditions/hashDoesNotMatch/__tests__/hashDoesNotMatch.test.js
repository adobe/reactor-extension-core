'use strict';

var conditionDelegateInjector = require('inject!../hashDoesNotMatch');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch')
});

describe('hash does not match condition delegate', function() {

  beforeAll(function() {
    document.location.hash = 'hashtest';
  });

  afterAll(function() {
    document.location.hash = '';
  });

  describe('exclude', function() {
    it('returns true when the hash does not match an unacceptable string', function() {
      var config = { hash: '#goo' };
      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the hash matches an unacceptable string', function() {
      var config = { hash: '#hashtest' };
      expect(conditionDelegate(config)).toBe(false);
    });

    it('returns true when the hash does not match an unacceptable regex', function() {
      var config = { hash: /#g.o/i };
      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the hash matches an unacceptable regex', function() {
      var config = { hash: /#hash.est/i };
      expect(conditionDelegate(config)).toBe(false);
    });
  });
});
