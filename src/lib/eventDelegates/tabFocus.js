'use strict';

var once = require('once');
var document = require('document');
var visibilityApi = require('resourceProvider').get('dtm', 'visibilityApi')();
var hidden = visibilityApi.hidden;
var visibilityChange = visibilityApi.visibilityChange;

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

var watchForTabFocus = once(function() {
  document.addEventListener(visibilityChange, function() {
    if (!document[hidden]) {
      var pseudoEvent = {
        type: 'tabfocus',
        target: document
      };

      triggers.forEach(function(trigger) {
        trigger(pseudoEvent, document.location);
      });
    }
  }, true);
});

/**
 * Tabfocus event. This event occurs when a webpage is visible or in focus. With tabbed browsing,
 * there is a reasonable chance that any given webpage is in the background and thus not
 * visible to the user.
 * @param {Object} config The event config object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  watchForTabFocus();
  triggers.push(trigger);
};
