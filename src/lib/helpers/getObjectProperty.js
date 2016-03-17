'use strict';

/**
 * Returns the deep property value of an object.
 * @param obj The object where the property will be searched.
 * @param property The property name to be returned. It can contain dots. (eg. prop.subprop1)
 * @returns {*}
 */
module.exports = function(obj, property) {
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
