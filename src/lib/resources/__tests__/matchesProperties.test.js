'use strict';

describe('matchesProperties', function() {
  var matchesPropertiesInjector = require('inject!../matchesProperties');
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var matchesProperties = matchesPropertiesInjector({
    textMatch: publicRequire('textMatch')
  });
  var element;
  
  beforeAll(function() {
    element = document.createElement('div');
    element.className = 'flashy';
    element.innerHTML = 'scooter';
  });
  
  it('returns true if the string property value matches', function() {
    var matches = matchesProperties(element, [
      {
        name: 'className',
        value: 'flashy'
      },
      {
        name: 'innerHTML',
        value: 'scooter'
      }
    ]);

    expect(matches).toBe(true);
  });

  it('returns true if the string property value does not match', function() {
    var matches = matchesProperties(element, [
      {
        name: 'className',
        value: 'flashy'
      },
      {
        name: 'innerHTML',
        value: 'hot rod'
      }
    ]);

    expect(matches).toBe(false);
  });

  it('returns true if the regex property value matches', function() {
    var matches = matchesProperties(element, [
      {
        name: 'className',
        value: 'flashy'
      },
      {
        name: 'innerHTML',
        value: 'scoot..',
        valueIsRegex: true
      }
    ]);

    expect(matches).toBe(true);
  });

  it('returns false if the regex property value does not match', function() {
    var matches = matchesProperties(element, [
      {
        name: 'className',
        value: 'flashy'
      },
      {
        name: 'innerHTML',
        value: 'hot r..',
        valueIsRegex: true
      }
    ]);

    expect(matches).toBe(false);
  });
});
