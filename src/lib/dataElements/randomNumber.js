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
 * The random number data element.
 * @param {Object} settings The data element settings object.
 * @param {number} settings.min The minimum (inclusive) of the range from which to derive a
 * random number.
 * @param {number} settings.max The maximum (inclusive) of the range from which to derive a
 * random number.
 * @returns {number}
 */
module.exports = function(settings) {
  var min = Math.ceil(settings.min);
  var max = Math.floor(settings.max);

  return min > max ? NaN : Math.floor(Math.random() * (max - min + 1)) + min;
};
