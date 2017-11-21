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

var bubbly = require('./helpers/createBubbly')();
var WeakMap = require('./helpers/weakMap');
var lastTriggeredByElement = new WeakMap();

var relevantMarkers = [];

/**
 * Unit string values.
 * @enum {string}
 */
var timePlayedUnit = {
  SECOND: 'second',
  PERCENT: 'percent'
};

var handleTimeUpdate = function(event) {
  var target = event.target;

  if (!target.seekable || !target.seekable.length) {
    return;
  }

  var seekable = target.seekable;
  var startTime = seekable.start(0);
  var endTime = seekable.end(0);
  var currentTime = target.currentTime;
  var playedSeconds = currentTime - startTime;

  var secondsLastTriggered = lastTriggeredByElement.get(target) || 0;

  relevantMarkers.forEach(function(relevantMarker) {
    var configuredSeconds = relevantMarker.unit === timePlayedUnit.SECOND ?
      relevantMarker.amount : (endTime - startTime) * (relevantMarker.amount / 100);
    if (configuredSeconds > secondsLastTriggered && configuredSeconds <= playedSeconds) {
      bubbly.evaluateEvent({
        target: target,
        amount: relevantMarker.amount,
        unit: relevantMarker.unit
      }, true);
    }
  });

  lastTriggeredByElement.set(target, playedSeconds);
};

document.addEventListener('timeupdate', handleTimeUpdate, true);

/**
 * The time played event. This event occurs when the media has been played for a specified amount
 * of time.
 * @param {Object} settings The event settings object.
 * @param {string} [settings.elementSelector] The CSS selector the element must match in order for
 * the rule to fire.
 * @param {Object[]} [settings.elementProperties] Property values the element must have in order
 * for the rule to fire.
 * @param {string} settings.elementProperties[].name The property name.
 * @param {string} settings.elementProperties[].value The property value.
 * @param {boolean} [settings.elementProperties[].valueIsRegex=false] Whether <code>value</code>
 * on the object instance is intended to be a regular expression.
 * @param {number} settings.amount The amount of time the media must be played before
 * this event is fired. This value may either be number of seconds (20 for 20 seconds) or a
 * percent value (20 for 20%).
 * @param {timePlayedUnit} settings.unit The unit of duration measurement.
 * @param {boolean} [settings.bubbleFireIfParent=true] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [settings.bubbleFireIfChildFired=true] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [settings.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  var doesMarkerMatch = function(marker) {
    return marker.amount === settings.amount && marker.unit === settings.unit;
  };

  var markerRegistered = relevantMarkers.some(doesMarkerMatch);

  if (!markerRegistered) {
    relevantMarkers.push({
      amount: settings.amount,
      unit: settings.unit
    });
  }

  bubbly.addListener(settings, function(syntheticEvent) {
    // Bubbling for this event is dependent upon the amount and unit configured for rules.
    // An event can "bubble up" to other rules with the same amount and unit but not to rules with
    // a different amount or unit. See the tests for how this plays out.
    if (syntheticEvent.amount === settings.amount && syntheticEvent.unit === settings.unit) {
      trigger(syntheticEvent);
    } else {
      return false;
    }
  });
};
