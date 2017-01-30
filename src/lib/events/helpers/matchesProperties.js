/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

var textMatch = require('./../../helpers/textMatch');

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
