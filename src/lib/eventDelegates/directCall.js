'use strict';

var logger = require('logger');

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
