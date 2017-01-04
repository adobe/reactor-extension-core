'use strict';

var Promise = require('@turbine/promise');
var getSourceByUrl = require('./getSourceByUrl');

var previousExecuteCodePromise = Promise.resolve();

module.exports = function(sourceUrl) {
  var sequentiallyLoadCodePromise = new Promise(function(resolve) {
    var loadCodePromise = getSourceByUrl(sourceUrl);

    Promise.all([
      loadCodePromise,
      previousExecuteCodePromise
    ]).then(function(values) {
      var source = values[0];
      resolve(source);
    });
  });

  previousExecuteCodePromise = sequentiallyLoadCodePromise;
  return sequentiallyLoadCodePromise;
};
