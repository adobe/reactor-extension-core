'use strict';

var window = require('window');
var triggers = [];

window.addEventListener('orientationchange', function(event) {
  if (triggers.length) {
    // This isn't really true though:
    // http://www.matthewgifford.com/blog/2011/12/22/a-misconception-about-window-orientation/
    // Also, is it bad that we're adding properties to the original event?
    event.orientation = window.orientation === 0 ? 'portrait' : 'landscape';

    triggers.forEach(function(trigger) {
      trigger(event, window);
    });
  }
});

/**
 * The orientationchange event. This event occurs when the orientation of the device has changed.
 * @param {Object} config The event config object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  triggers.push(trigger);
};
