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

var document = require('@turbine/document');
var textMatch = require('../helpers/textMatch');

/**
 * Path condition. Determines if the actual path matches at least one acceptable path.
 * @param {Object} settings Condition settings.
 * @param {Object[]} settings.paths Acceptable paths.
 * @param {string} settings.paths[].value An acceptable path value.
 * @param {boolean} [settings.paths[].valueIsRegex=false] Whether <code>value</code> on the object
 * instance is intended to be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  // It's odd that we're including the querystring in the match.
  var path = document.location.pathname + document.location.search;
  return settings.paths.some(function(acceptablePath) {
    var acceptableValue = acceptablePath.valueIsRegex ?
      new RegExp(acceptablePath.value, 'i') : acceptablePath.value;
    return textMatch(path, acceptableValue);
  });
};
