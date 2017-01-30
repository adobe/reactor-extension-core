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

var once = require('@turbine/once');

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

var watchForWindowLoad = once(function() {
  window.addEventListener('load', function() {
    var pseudoEvent = {
      type: 'windowload',
      target: document.location
    };

    triggers.forEach(function(trigger) {
      trigger(document.location, pseudoEvent);
    });
  }, true);
});

/**
 * Onload event. This event occurs at the end of the document loading process. At this point,
 * all of the objects in the document are loaded in the DOM, and all images, scripts, links,
 * and sub-frames have finished loading.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  watchForWindowLoad();
  triggers.push(trigger);
};
