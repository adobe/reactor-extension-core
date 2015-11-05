'use strict';

var conditionDelegateInjector = require('inject!../hashMatches');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch')
});

describe('hash matches condition delegate', function() {

  beforeAll(function() {
    document.location.hash = 'hashtest';
  });

  afterAll(function() {
    document.location.hash = '';
  });

  it('returns true when the hash matches an acceptable string', function() {
    var config = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: '#hashtest'
        }
      ]
    };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the hash does not match an acceptable string', function() {
    var config = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: '#goo'
        }
      ]
    };
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the hash matches an acceptable regex', function() {
    var config = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: 'Has.test',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the hash does not match an acceptable regex', function() {
    var config = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: '#g.o',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(config)).toBe(false);
  });
});
