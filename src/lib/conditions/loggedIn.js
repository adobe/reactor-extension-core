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

var getDataElementValue = require('@turbine/get-data-element-value');

/**
 * Logged in condition. Determines if the user is logged in.
 * @param {Object} settings Condition settings.
 * @param {string} settings.dataElement The name of the data element identifying
 * whether the user is logged in.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return Boolean(getDataElementValue(settings.dataElement, true));
};

