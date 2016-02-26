'use strict';

var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
var dataElementDelegateInjector = require('inject!../variable')
var dataElementDelegate = dataElementDelegateInjector({
  window: {
    my: {
      path: 'bar'
    }
  },
  'get-extension': publicRequire('get-extension')
});

describe('variable data element delegate', function() {
  it('should return an object property value', function() {
    var settings = {
      path: 'my.path'
    };

    var value = dataElementDelegate(settings);

    expect(value).toBe('bar');
  });
});
