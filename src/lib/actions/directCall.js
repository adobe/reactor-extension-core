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

var window = require('@adobe/reactor-window');

/**
 * The custom code action. This loads and executes custom JavaScript or HTML provided by the user.
 * @param {Object} settings Action settings.
 * @param {string} settings.identifier The identifier of the "Direct Call" Event Type that should
 * be called.
 * @param {Object} settings.detail The detail to be passed into the event object of the triggered
 * rule.
 * @param {Object} event The underlying event object that triggered the rule.
 * @param {Object} event.element The element that the rule was targeting.
 * @param {Object} event.target The element on which the event occurred.
 */
module.exports = function (settings, event) {
  if (settings && settings.identifier) {
    var detail = settings.detail;
    if (detail) {
      detail = detail.call(event.element, event, event.target);
      window._satellite.track(settings.identifier, detail);
    } else {
      window._satellite.track(settings.identifier);
    }
  }
};
