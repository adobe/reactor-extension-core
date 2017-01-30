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
var document = require('@turbine/document');
var visibilityApi = require('./helpers/visibilityApi')();
var hiddenProperty = visibilityApi.hiddenProperty;
var visibilityChangeEventType = visibilityApi.visibilityChangeEventType;

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

var watchForTabFocus = once(function() {
  document.addEventListener(visibilityChangeEventType, function() {
    if (!document[hiddenProperty]) {
      var pseudoEvent = {
        type: 'tabfocus',
        target: document
      };

      triggers.forEach(function(trigger) {
        trigger(document.location, pseudoEvent);
      });
    }
  }, true);
});

/**
 * Tabfocus event. This event occurs when a webpage is visible or in focus. With tabbed browsing,
 * there is a reasonable chance that any given webpage is in the background and thus not
 * visible to the user.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  watchForTabFocus();
  triggers.push(trigger);
};
