'use strict';
var window = require('window');

var getObjectProperty = function(obj, property) {
  var propertyChain = property.split('.');
  var currentValue = obj;

  for (var i = 0, len = propertyChain.length; i < len; i++) {
    if (currentValue == null) {
      return undefined;
    }

    currentValue = currentValue[propertyChain[i]];
  }

  return currentValue;
};

/**
 * The variable data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.path The global path to the variable holding the data element value.
 * @returns {string}
 */
module.exports = function(settings) {
  return getObjectProperty(window, settings.path);
};
