'use strict';

var document = require('document');
var once = require('once');

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

window._satellite = window._satellite || {};

var triggerPageBottom = once(function() {
  var pseudoEvent = {
    type: 'pagebottom',
    target: document.location
  };

  triggers.forEach(function(trigger) {
    trigger(pseudoEvent, document.location);
  });
});

/**
 * Public function intended to be called by the user at the bottom of the page.
 */
window._satellite.pageBottom = triggerPageBottom;

/**
 * Trigger it on DOMContent loaded in case someone didn't add _satellite.pageBottom at the end of
 * the page. pageBottom will only be triggered only once even if it's called multiple times/
 */
document.addEventListener('DOMContentLoaded', triggerPageBottom);

/**
 * Page top event. This event occurs as soon as the user calls _satellite.pageBottom() (which is
 * supposed to be at the bottom of the page).
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  triggers.push(trigger);
};
