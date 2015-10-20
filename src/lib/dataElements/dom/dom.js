'use strict';

module.exports = function(config) {
  var elements = document.querySelectorAll(config.selector);
  if (elements.length > 0) {
    var element = elements[0];

    var property = config.property;

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
