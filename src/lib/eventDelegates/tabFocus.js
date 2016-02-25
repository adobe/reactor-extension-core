'use strict';

var once = require('once');
var document = require('document');
var extension = require('get-extension')('dtm');
var visibilityApi = extension.getResource('visibility-api')();
var hiddenProperty = visibilityApi.hiddenProperty;
var visibilityChangeEventType = visibilityApi.visibilityChangeEventType;

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

var watchForTabFocus = once(function() {
  document.addEventListener(visibilityChangeEventType, function() {
    if (!document[hiddenProperty]) {
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
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  watchForTabFocus();
  triggers.push(trigger);
};
