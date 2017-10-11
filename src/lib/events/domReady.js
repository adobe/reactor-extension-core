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

var once = require('./helpers/once');

var triggers = [];

var handleDOMContentLoaded = function(event) {
  document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded, true);

  var syntheticEvent = {
    element: document,
    target: document,
    nativeEvent: event
  };

  triggers.forEach(function(trigger) {
    trigger(syntheticEvent);
  });
};

var watchForContentLoaded  = once(function() {
  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded, true);
});

/**
 * DOM ready event. This event occurs as soon as HTML document has been completely loaded and
 * parsed, without waiting for stylesheets, images, and subframes to finish loading.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  watchForContentLoaded();
  triggers.push(trigger);
};
