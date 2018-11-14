'use strict';

/**
 * Polls an escape function. Once the escape function returns true, executes a run function.
 * @param {Function} escapeFunction A function that will be repeatedly executed and should return
 * true when the run function should be called.
 * @param {number} checkDelay Number of milliseconds to wait before running the escape function
 * again.
 * @returns {{then: Function}} The run function should be registered via the then method.
 */
(function() {
  window.waitUntil = function(escapeFunction, checkDelay) {
    var _runFunction;

    var interval = setInterval(function() {
      if (escapeFunction()) {
        clearInterval(interval);

        if (_runFunction) {
          _runFunction();
        }
      }
    }, checkDelay || 1);

    return {
      then: function(runFunction) {
        _runFunction = runFunction;
      }
    };
  };
})();
