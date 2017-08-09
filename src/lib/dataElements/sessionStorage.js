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

/**
 * The session storage data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.name The name of the session storage item for which a value should be
 * retrieved.
 * @returns {string}
 */
module.exports = function(settings) {
  // When session storage is disabled on Safari, the mere act of referencing window.sessionStorage
  // throws an error. For this reason, referencing window.sessionStorage without being inside
  // a try-catch should be avoided.
  try {
    return window.sessionStorage.getItem(settings.name);
  } catch (e) {
    return null;
  }
};
