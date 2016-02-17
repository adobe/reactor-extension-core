'use strict';

var once = require('once');

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

var watchForWindowLoad = once(function() {
  window.addEventListener('load', function() {
    var pseudoEvent = {
      type: 'windowload',
      target: document.location
    };

    triggers.forEach(function(trigger) {
      trigger(pseudoEvent, document.location);
    });
  }, true);
});

/**
 * Onload event. This event occurs at the end of the document loading process. At this point,
 * all of the objects in the document are loaded in the DOM, and all images, scripts, links,
 * and sub-frames have finished loading.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  watchForWindowLoad();
  triggers.push(trigger);
};
