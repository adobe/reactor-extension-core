/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
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

var document = require('@adobe/reactor-document');
var once = require('./helpers/once');

var triggers = [];

var domContentLoadedTriggered = false;

var createSyntheticEvent = function(event) {
  return {
    element: document,
    target: document,
    nativeEvent: event
  };
};

var handleDOMContentLoaded = once(function(event) {
  domContentLoadedTriggered = true;

  var syntheticEvent = createSyntheticEvent(event);

  triggers.forEach(function(trigger) {
    trigger(syntheticEvent);
  });

  // No need to hold onto triggers anymore.
  triggers = null;
});

// If DOMContentLoaded has already occurred (possible if the Launch library is loaded
// asynchronously), we execute the triggers immediately. It's possible this will cause issues
// on IE10 and lower since readyState can be set to 'interactive' before DOM content
// has been fully loaded:
// https://bugs.jquery.com/ticket/12282
// https://www.drupal.org/node/2235425
// https://github.com/mobify/mobifyjs/issues/136
// We are okay with this risk as IE10 usage is very low.
// Also, when the library is asynchronously loaded, rules could fire seemingly out of order.
// For example, rules using the DOM Ready event may fire before rules using the Page Bottom event.
// That is because the underlying event for these rules have all already occurred, so the rules
// are all immediately firing. The order is therefore dictated by the order that the rules are
// emitted in the container (and therefore processed by Turbine). We are okay with documenting this
// for users and suggesting they not use events that may actually occurred before the library has
// loaded.
document.readyState === 'loading' ?
  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded, true) :
  handleDOMContentLoaded();

/**
 * DOM ready event. This event occurs as soon as HTML document has been completely loaded and
 * parsed, without waiting for stylesheets, images, and subframes to finish loading.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  domContentLoadedTriggered ? trigger(createSyntheticEvent()) : triggers.push(trigger);
};
