/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

/**
 * Object where the key is the call name and the value is an array of all rule trigger functions
 * for that call name.
 * @type {Object}
 */
var triggersByIdentifier = {};

window._satellite = window._satellite || {};

/**
 * Public function intended to be called by the user.
 * @param {string} identifier The identifier passed to _satellite.track().
 * @param {*} [detail] Any detail that should be passed along to conditions and actions.
 */
window._satellite.track = function(identifier, detail) {
  identifier = identifier.trim();
  var triggers = triggersByIdentifier[identifier];
  if (triggers) {
    
    triggers.forEach(function(trigger) {
      var syntheticEvent = {
        identifier: identifier,
        detail: detail
      };
      trigger(syntheticEvent);
    });

    var logMessage = 'Rules using the direct call event type with identifier "' + identifier +
      '" have been triggered' + (detail ? ' with additional detail:' : '.');
    var logArgs = [logMessage];

    if (detail) {
      logArgs.push(detail);
    }

    turbine.logger.log.apply(turbine.logger, logArgs);
  } else {
    turbine.logger.log('"' + identifier + '" does not match any direct call identifiers.');
  }
};

/**
 * Direct call event. This event occurs as soon as the user calls _satellite.track().
 * @param {Object} settings The event settings object.
 * @param {string} settings.identifier The identifier passed to _satellite.track().
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  var triggers = triggersByIdentifier[settings.identifier];

  if (!triggers) {
    triggers = triggersByIdentifier[settings.identifier] = [];
  }

  triggers.push(trigger);
};
