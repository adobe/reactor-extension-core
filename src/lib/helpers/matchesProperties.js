'use strict';

var textMatch = require('./textMatch.js');

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
 * @param {Object[]} properties The criteria of properties to match again.
 * @param {string} properties.name The property name.
 * @param {string} properties.value The property value.
 * @param {boolean} [properties.valueIsRegex=false] Whether <code>value</code> on the
 * object instance is intended to be a regular expression.
 * @returns {boolean} Whether the element matches the criteria.
 */
module.exports = function(element, properties) {
  if (properties) {
    return properties.every(function(property) {
      var actualValue = getElementProperty(element, property.name);
      var criterionValue = property.valueIsRegex ? new RegExp(property.value, 'i') : property.value;
      return textMatch(actualValue, criterionValue);
    });
  }
  return true;
};
