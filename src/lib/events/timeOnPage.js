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
var visibilityApi = require('./helpers/visibilityApi')();
var Timer = require('./helpers/timer');

var hiddenProperty = visibilityApi.hiddenProperty;
var visibilityChangeEventType = visibilityApi.visibilityChangeEventType;
var triggers = {};

var onMarkerPassed = function(timeOnPageMilliseconds) {
  var syntheticEvent = {
    timeOnPage: timeOnPageMilliseconds / 1000
  };

  triggers[timeOnPageMilliseconds].forEach(function(trigger) {
    trigger(syntheticEvent);
  });
};

var setupTimer = once(function() {
  var timer = new Timer();
  timer.on('markerPassed', onMarkerPassed);

  document.addEventListener(visibilityChangeEventType, function() {
    if (document[hiddenProperty]) {
      timer.pause();
    } else {
      timer.resume();
    }
  }, true);

  timer.start();
  return timer;
});

/**
 * Time on page event. The event is triggered by a timer. The timer receives a list of markers
 * that will be used to trigger a callback method. The callback is called whenever the counted time
 * passes the provided markers. The timer will be paused whenever the user will switch to another
 * tab and it will be resumed when the user returns back to the tab.
 * @param {Object} settings The event settings object.
 * @param {number} settings.timeOnPage The number of seconds the user must be on the page
 * before the rule is triggered.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  var timer = setupTimer();
  var timeOnPageMilliseconds = settings.timeOnPage * 1000;

  timer.addMarker(timeOnPageMilliseconds);

  if (!triggers[timeOnPageMilliseconds]) {
    triggers[timeOnPageMilliseconds] = [];
  }

  triggers[timeOnPageMilliseconds].push(trigger);
};
