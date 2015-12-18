'use strict';

/**
 * The dom data element.
 * @param {Object} config The data element config object.
 * @param {string} config.elementSelector The CSS selector for a DOM element.
 * @param {string} config.elementProperty The name of the property or attribute of the DOM
 * element.
 * @returns {string}
 */
module.exports = function(config) {
  var elements = document.querySelectorAll(config.elementSelector);
  if (elements.length > 0) {
    var element = elements[0];

    var property = config.elementProperty;

    // TODO Can we use getObjectProperty() here or at least getElementText()?
    if (property === 'text') {
      return element.innerText || element.textContent;
    } else if (property in element) {
      return element[property];
    } else {
      return element.getAttribute ? element.getAttribute(property) : undefined;
    }
  }
};
