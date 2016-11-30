'use strict';

var once = require('once');
var document = require('document');
var visibilityApi = require('./helpers/visibilityApi')();
var hiddenProperty = visibilityApi.hiddenProperty;
var visibilityChangeEventType = visibilityApi.visibilityChangeEventType;

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

var watchForTabBlur = once(function() {
  document.addEventListener(visibilityChangeEventType, function() {
    if (document[hiddenProperty]) {
      var pseudoEvent = {
        type: 'tabblur',
        target: document
      };

      triggers.forEach(function(trigger) {
        trigger(document.location, pseudoEvent);
      });
    }
  }, true);
});

/**
 * Tabblur event. This event occurs when a webpage is not visible or not in focus.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  watchForTabBlur();
  triggers.push(trigger);
};
