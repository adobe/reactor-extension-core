'use strict';

var conditionDelegateInjector = require('inject!../hash');
var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  getExtension: publicRequire('getExtension')
});

describe('hash condition delegate', function() {

  beforeAll(function() {
    document.location.hash = 'hashtest';
  });

  afterAll(function() {
    document.location.hash = '';
  });

  it('returns true when the hash matches an acceptable string', function() {
    var settings = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: '#hashtest'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the hash does not match an acceptable string', function() {
    var settings = {
      hashes: [
        {
          value: '#foo'
        },
        {
          value: '#goo'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the hash matches an acceptable regex', function() {
    var settings = {
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
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the hash does not match an acceptable regex', function() {
    var settings = {
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
    expect(conditionDelegate(settings)).toBe(false);
  });
});
