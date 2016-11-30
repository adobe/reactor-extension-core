'use strict';

var Promise = require('promise');
var getSourceByUrl = require('./getSourceByUrl');

var previousExecuteCodePromise = Promise.resolve();

module.exports = function(action) {
  var sequentiallyLoadCodePromise = new Promise(function(resolve) {
    var loadCodePromise = getSourceByUrl(action.settings.sourceUrl);

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
