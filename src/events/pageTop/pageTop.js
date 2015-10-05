'use strict';

var pseudoEvent = {
  type: 'pagetop',
  target: document.location
};

/**
 * Page top event. This event occurs as soon as DTM is loaded (which is supposed to be at the
 * top of the page).
 * @param {Object} config The event config object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  trigger(pseudoEvent, document.location);
};
