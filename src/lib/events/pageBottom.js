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

var onPageBottom = require('@turbine/on-page-bottom');
var document = require('@turbine/document');

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

onPageBottom(function() {
  var pseudoEvent = {
    type: 'pagebottom',
    target: document.location
  };

  triggers.forEach(function(trigger) {
    trigger(document.location, pseudoEvent);
  });
});

/**
 * Page bottom event. This event occurs as soon as the user calls _satellite.pageBottom() (which is
 * supposed to be at the bottom of the page).
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  triggers.push(trigger);
};
