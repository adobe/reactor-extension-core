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

var logger = require('@turbine/logger');

/**
 * Object where the key is the call name and the value is an array of all rule trigger functions
 * for that call name.
 * @type {Object}
 */
var triggersByCallName = {};

window._satellite = window._satellite || {};

/**
 * Public function intended to be called by the user.
 * @param {string} name The string matching a string configured for a rule.
 */
window._satellite.track = function(name) {
  name = name.trim();
  var triggers = triggersByCallName[name];
  if (triggers) {
    triggers.forEach(function(trigger) {
      trigger();
    });
  } else {
    logger.log('Direct call rule ' + name + ' not found.');
  }
};

/**
 * Direct call event. This event occurs as soon as the user calls _satellite.track().
 * @param {Object} settings The event settings object.
 * @param {string} settings.name The string identifier of the direct-call rule.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  var triggers = triggersByCallName[settings.name];

  if (!triggers) {
    triggers = triggersByCallName[settings.name] = [];
  }

  triggers.push(trigger);
};
