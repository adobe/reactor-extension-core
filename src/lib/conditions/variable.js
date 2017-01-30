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
var window = require('@turbine/window');

var getObjectProperty = require('../helpers/getObjectProperty');
var textMatch = require('../helpers/textMatch');

/**
 * Variable condition. Determines if a particular JS variable's actual value matches
 * an acceptable value.
 * @param {Object} settings Condition settings.
 * @param {number} settings.name The name of the JS variable (e.g., event.target.id).
 * @param {string} settings.value An acceptable JS variable value.
 * @param {boolean} [settings.valueIsRegex=false] Whether <code>settings.value</code> is intended to
 * be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var acceptableValue = settings.valueIsRegex ? new RegExp(settings.value, 'i') : settings.value;
  var variable = settings.name;

  if (variable.substring(0, 7) === 'window.') {
    variable = variable.slice(7);
  }

  return textMatch(getObjectProperty(window, variable), acceptableValue);
};
