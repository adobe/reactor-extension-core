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

var window = require('@adobe/reactor-window');
var document = require('@adobe/reactor-document');
var once = require('./helpers/once');

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

var loadTriggered = false;

var createSyntheticEvent = function(event) {
  return {
    element: window,
    target: window,
    nativeEvent: event
  };
};

var handleLoad = once(function(event) {
  loadTriggered = true;

  var syntheticEvent = createSyntheticEvent(event);

  triggers.forEach(function(trigger) {
    trigger(syntheticEvent);
  });

  // No need to hold onto triggers anymore.
  triggers = null;
});

// If window load event has already occurred (possible if the Launch library is loaded
// asynchronously after the load event), we execute the triggers immediately. This is an unlikely
// scenario because any consumer wanting to load the script asynchronously would likely add an
// async attribute on the script tag, which would still load the library before the load event.
// Even so, this is a use case we would like to support.
// Also, when the library is asynchronously loaded, rules could fire seemingly out of order.
// For example, rules using the Window Loaded event may fire before rules using the Page Bottom
// event. That is because the underlying event for these rules have all already occurred, so the
// rules are all immediately firing. The order is therefore dictated by the order that the rules are
// emitted in the container (and therefore processed by Turbine). We are okay with documenting this
// for users and suggesting they not use events that may actually occurred before the library has
// loaded.
document.readyState === 'complete' ?
  handleLoad() :
  window.addEventListener('load', handleLoad, true);

/**
 * Onload event. This event occurs at the end of the document loading process. At this point,
 * all of the objects in the document are loaded in the DOM, and all images, scripts, links,
 * and sub-frames have finished loading.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  loadTriggered ? trigger(createSyntheticEvent()) : triggers.push(trigger);
};
