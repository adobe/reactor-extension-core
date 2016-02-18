'use strict';

var once = require('once');

var triggers = [];

var handleDOMContentLoaded = function() {
  document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded, true);

  triggers.forEach(function(trigger) {
    var pseudoEvent = {
      type: 'domready',
      target: document.location
    };

    trigger(pseudoEvent, document.location);
  });
};

var watchForContentLoaded  = once(function() {
  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded, true);
});

/**
 * DOM ready event. This event occurs as soon as HTML document has been completely loaded and
 * parsed, without waiting for stylesheets, images, and subframes to finish loading.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  watchForContentLoaded();
  triggers.push(trigger);
};
