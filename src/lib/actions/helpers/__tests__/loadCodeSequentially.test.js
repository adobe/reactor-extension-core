'use strict';

var sequentiallyLoadCodePromiseInjector = require('inject!../loadCodeSequentially');
var Promise = require('@reactor/turbine/lib/require')('promise');

var sequentiallyLoadCodePromise = sequentiallyLoadCodePromiseInjector({
  './getSourceByUrl': function(sourceUrl) {
    if (sourceUrl === 'url1') {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve('url1 source code');
        }, 0);
      });
    } else {
      return Promise.resolve('url2 source code');
    }
  }
});

describe('load code sequentially', function() {
  it('does the correct loaded order', function(done) {
    var loadedCode = [];

    var action1 = sequentiallyLoadCodePromise('url1').then(function(code) {
      loadedCode.push(code);
    });

    var action2 = sequentiallyLoadCodePromise('url2').then(function(code) {
      loadedCode.push(code);
    });

    Promise.all([
      action2, action1
    ]).then(function() {
      expect(loadedCode).toEqual(['url1 source code', 'url2 source code']);
      done();
    });
  });
});
