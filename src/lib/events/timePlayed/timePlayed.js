'use strict';

var bubbly = require('resourceProvider').get('dtm', 'createBubbly')();
var dataStash = require('createDataStash')('timePlayed');

var relevantMarkers = [];

/**
 * Unit string values.
 * @enum {string}
 */
var timePlayedUnit = {
  SECOND: 'second',
  PERCENT: 'percent'
};

var getPseudoEventType = function(amount, unit) {
  var unitSuffix = unit === timePlayedUnit.SECOND ? 's' : '%';
  return 'videoplayed(' + amount + unitSuffix + ')';
};

var getPseudoEvent = function(amount, unit, target) {
  return {
    type: getPseudoEventType(amount, unit),
    target: target,
    amount: amount,
    unit: unit
  };
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
  var targetDataStash = dataStash(target);

  var secondsLastTriggered = targetDataStash.lastTriggered || 0;
  var pseudoEvent;

  relevantMarkers.forEach(function(relevantMarker) {
    var configuredSeconds = relevantMarker.unit === timePlayedUnit.SECOND ?
      relevantMarker.amount : (endTime - startTime) * (relevantMarker.amount / 100);
    if (configuredSeconds > secondsLastTriggered && configuredSeconds <= playedSeconds) {
      pseudoEvent = getPseudoEvent(relevantMarker.amount, relevantMarker.unit, target);
      bubbly.evaluateEvent(pseudoEvent);
    }
  });

  targetDataStash.lastTriggered = playedSeconds;
};

document.addEventListener('timeupdate', handleTimeUpdate, true);

/**
 * The time played event. This event occurs when the media has been played for a specified amount
 * of time.
 * @param {Object} config The event config object.
 * @param {string} config.selector The CSS selector for elements the rule is targeting.
 * @param {number} config.amount The amount of time the media must be played before
 * this event is fired. This value may either be number of seconds (20 for 20 seconds) or a
 * percent value (20 for 20%).
 * @param {timePlayedUnit} config.unit The unit of duration measurement.
 * @param {boolean} [config.bubbleFireIfParent=false] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {Object} [config.elementProperties] Property names and values the element must have in
 * order for the rule to fire.
 * @param {boolean} [config.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  var doesMarkerMatch = function(marker) {
    return marker.amount === config.amount && marker.unit === config.unit;
  };

  var markerRegistered = relevantMarkers.some(doesMarkerMatch);

  if (!markerRegistered) {
    relevantMarkers.push({
      amount: config.amount,
      unit: config.unit
    });
  }

  var pseudoEventType = getPseudoEventType(config.amount, config.unit);

  bubbly.addListener(config, function(event, relatedElement) {
    // Bubbling for this event is dependent upon the amount and unit configured for rules.
    // An event can "bubble up" to other rules with the same amount and unit but not to rules with
    // a different amount or unit. See the tests for how this plays out.
    if (event.type === pseudoEventType) {
      trigger(event, relatedElement);
    } else {
      return false;
    }
  });
};
