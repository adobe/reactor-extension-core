'use strict';

describe('matchesSelector', function() {
  var matchesSelector = require('../matchesSelector');

  it('returns true if the selector matches', function() {
    var div = document.createElement('div');
    div.className = 'foo';

    // IE9 requires the element to be added to the document.
    document.body.appendChild(div);
    expect(matchesSelector(div, '.foo')).toBe(true);
    document.body.removeChild(div);
  });

  it('returns false if the selector does not match', function() {
    var div = document.createElement('div');
    div.className = 'goo';
    // IE9 requires the element to be added to the document.
    document.body.appendChild(div);
    expect(matchesSelector(div, '.foo')).toBe(false);
    document.body.removeChild(div);
  });

  it('returns false for document', function() {
    expect(matchesSelector(document, 'document')).toBe(false);
  });

  it('returns false for window', function() {
    expect(matchesSelector(window, 'window')).toBe(false);
  });

  it('logs a warning when selector matching fails', function() {
    var logger = jasmine.createSpyObj('logger', ['warn']);
    var matchesSelectorInjector = require('inject!../matchesSelector');
    var matchesSelector = matchesSelectorInjector({ logger: logger});

    matchesSelector(document.body, 'somewrong#!@$%selector');
    expect(logger.warn).toHaveBeenCalled();
  });
});
