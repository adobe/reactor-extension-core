'use strict';

var onPageBottom = require('on-page-bottom');
var document = require('document');

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

onPageBottom(function() {
  var pseudoEvent = {
    type: 'pagebottom',
    target: document.location
  };

  triggers.forEach(function(trigger) {
    trigger(document.location, pseudoEvent);
  });
});

/**
 * Page bottom event. This event occurs as soon as the user calls _satellite.pageBottom() (which is
 * supposed to be at the bottom of the page).
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  triggers.push(trigger);
};
