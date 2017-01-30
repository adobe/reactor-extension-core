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

/**
 * The dom data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.elementSelector The CSS selector for a DOM element.
 * @param {string} settings.elementProperty The name of the property or attribute of the DOM
 * element.
 * @returns {string}
 */
module.exports = function(settings) {
  var elements = document.querySelectorAll(settings.elementSelector);
  if (elements.length > 0) {
    var element = elements[0];

    var property = settings.elementProperty;

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
