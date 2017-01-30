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

var clientInfo = require('@turbine/client-info');

/**
 * Browser condition. Determines if the actual browser matches at least one acceptable browser.
 * @param {Object} settings Condition settings.
 * @param {string[]} settings.browsers An array of acceptable browsers.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return settings.browsers.indexOf(clientInfo.browser) !== -1;
};

