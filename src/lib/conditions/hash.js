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

var textMatch = require('../helpers/textMatch');

/**
 * Hash condition. Determines if the actual hash (URL fragment identifier) matches at least one
 * acceptable hash.
 * @param {Object} settings Condition settings.
 * @param {Object[]} settings.hashes Acceptable hashes.
 * @param {string} settings.hashes[].value An acceptable hash value
 * @param {boolean} [settings.hashes[].valueIsRegex=false] Whether <code>value</code> on the object
 * instance is intended to be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var hash = document.location.hash;
  return settings.hashes.some(function(acceptableHash) {
    var acceptableValue = acceptableHash.valueIsRegex ?
      new RegExp(acceptableHash.value, 'i') : acceptableHash.value;
    return textMatch(hash, acceptableValue);
  });
};

