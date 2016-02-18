'use strict';

var conditionDelegate = require('../custom');

describe('custom condition delegate', function() {
  it('should run a user-defined function', function() {
    var settings = {
      script: function() {
        return true;
      }
    };

    var event = {
      currentTarget: {},
      target: {}
    };

    var relatedElement = {};

    spyOn(settings, 'script').and.callThrough();
    conditionDelegate(settings, event, relatedElement);

    expect(settings.script.calls.first()).toEqual({
      object: relatedElement,
      args: [event, event.target],
      returnValue: true
    });
  });
});
