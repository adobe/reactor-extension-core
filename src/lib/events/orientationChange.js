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
var triggers = [];

window.addEventListener('orientationchange', function(event) {
  if (triggers.length) {
    // This isn't really true though:
    // http://www.matthewgifford.com/blog/2011/12/22/a-misconception-about-window-orientation/
    // Also, is it bad that we're adding properties to the original event?
    event.orientation = window.orientation === 0 ? 'portrait' : 'landscape';

    triggers.forEach(function(trigger) {
      trigger(window, event);
    });
  }
});

/**
 * The orientationchange event. This event occurs when the orientation of the device has changed.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  triggers.push(trigger);
};
