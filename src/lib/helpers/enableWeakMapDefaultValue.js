'use strict';

/**
 * Modifies a weakmap so that when get() is called with a key for which no entry is found,
 * a default value will be stored and then returned for the key.
 * @param {Object} weakMap The WeakMap instance to modify.
 * @param {Function} defaultValueFactory A function that returns the default value that should
 * be used.
 */
module.exports = function(weakMap, defaultValueFactory) {
  var originalGet = weakMap.get;

  weakMap.get = function(key) {
    if (!weakMap.has(key)) {
      weakMap.set(key, defaultValueFactory());
    }

    return originalGet.apply(this, arguments);
  };

  return weakMap;
};
