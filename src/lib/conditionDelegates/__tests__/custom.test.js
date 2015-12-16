'use strict';

var conditionDelegate = require('../custom');

describe('custom condition delegate', function() {
  it('should run a user-defined function', function() {
    var config = {
      script: function() {
        return true;
      }
    };

    var event = {
      currentTarget: {},
      target: {}
    };

    var relatedElement = {};

    spyOn(config, 'script').and.callThrough();
    conditionDelegate(config, event, relatedElement);

    expect(config.script.calls.first()).toEqual({
      object: relatedElement,
      args: [event, event.target],
      returnValue: true
    });
  });
});
