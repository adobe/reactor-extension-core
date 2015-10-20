'use strict';

var textMatch = require('textMatch');

var getElementProperty = function(element, property) {
  if (property === '@text' || property === 'innerText') {
    return element.textContent || element.innerText;
  } else if (property in element) {
    return element[property];
  } else if (element.getAttribute) {
    return element.getAttribute(property);
  }
};

/**
 * Determines whether an element's properties and their values match a set of properties and values.
 * If the element doesn't have the property, the element's attribute with the same name will be
 * evaluated if it exists.
 * @param {HTMLElement} element The element to match against.
 * @param {Object} properties The criteria of properties to match again. The key is the property
 * name and the value is the property value.
 * @returns {boolean} Whether the element matches the criteria.
 */
module.exports = function(element, properties) {
  if (properties) {
    var propertyNames = Object.keys(properties);
    for (var i = 0; i < propertyNames.length; i++) {
      var propertyName = propertyNames[i];
      var criterionValue = properties[propertyName];
      var actualValue = getElementProperty(element, propertyName);
      if (!textMatch(actualValue, criterionValue)) {
        return false;
      }
    }
  }
  return true;
};
