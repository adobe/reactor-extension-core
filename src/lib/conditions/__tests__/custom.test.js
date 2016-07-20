'use strict';

var conditionDelegate = require('../custom');

describe('custom condition delegate', function() {
  it('should run a user-defined function', function() {
    var settings = {
      source: function() {
        return true;
      }
    };

    var event = {
      currentTarget: {},
      target: {}
    };

    var relatedElement = {};

    spyOn(settings, 'source').and.callThrough();
    conditionDelegate(settings, relatedElement, event);

    expect(settings.source.calls.first()).toEqual({
      object: relatedElement,
      args: [event, event.target],
      returnValue: true
    });
  });
});
