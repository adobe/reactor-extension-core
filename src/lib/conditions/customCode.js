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
 * Custom code condition. This executes condition code provided by the user.
 * @param {Object} settings Condition settings.
 * @param {HTMLElement} [relatedElement] The element the rule was targeting.
 * @param {Function} settings.source The custom script function.
 * @param {Object} [event] The underlying event object the triggered the rule.
 * @param {Object} [event.target] The element where the event originated.
 * @returns {boolean}
 */
module.exports = function(settings, relatedElement, event) {
  return settings.source.call(
    relatedElement,
    event,
    event ? event.target : undefined);
};
