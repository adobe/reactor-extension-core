'use strict';

var matcher = require('../textMatch');

describe('textMatch', function() {
  it('returns true if string is an exact match', function() {
    expect(matcher('This is My House', 'This is My House')).toBe(true);
  });

  it('returns false if string is not an exact match', function() {
    expect(matcher('This is My House', 'This is NOT My House')).toBe(false);
  });

  it('returns true if the regex matches', function() {
    expect(matcher('This is NOT my House', /^T/)).toBe(true);
  });

  it('returns false if the regex does not match', function() {
    expect(matcher('This is NOT my House', /^Z/)).toBe(false);
  });

  it('returns false if the string is null', function() {
    expect(matcher(null, 'Something')).toBe(false);
  });

  it('Throws an Illegal Argument error message if the pattern is not defined', function() {
    var errorThrower = function() {
      matcher('This is My House');
    };
    expect(errorThrower).toThrowError('Illegal Argument: Pattern is not present');
  });
});
