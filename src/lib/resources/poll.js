'use strict';

var POLL_INTERVAL = 3000;

var once = require('once');
var listeners = [];
var iterIndex = 0;

var executeListeners = function() {
  for (iterIndex = 0; iterIndex < listeners.length; iterIndex++) {
    listeners[iterIndex].callback();
  }
};

var startPolling = once(function() {
  // When testing we'll let the tests tick the poller manually.
  if (ENV_TEST) {
    window.__tickGlobalPoll = executeListeners;
  } else {
    setInterval(executeListeners, POLL_INTERVAL);
  }
});

module.exports = function(name, callback) {
  var listener = {
    name: name,
    callback: callback
  };
  listeners.push(listener);

  startPolling();

  return function() {
    var index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);

      // If the listener is unsubscribed while we're iterating over listeners we need to
      // adjust the iteration index accordingly.
      if (index <= iterIndex) {
        iterIndex--;
      }
    }
  };
};
