'use strict';

var debounce = require('debounce');
var once = require('once');

var history = window.history;
var lastURI = window.location.href;
var triggers = [];

/**
 * Replaces a method on an object with a proxy method only calls the original method but also
 * another explicitly defined function.
 * @param {Object} object The object containing the method to replace.
 * @param {String} methodName The name of the method to replace with the proxy method.
 * @param {Function} fn A function that should be called after the original method is called.
 */
var callThrough = function(object, methodName, fn) {
  var original = object[methodName];
  object[methodName] = function() {
    var returnValue = original.apply(object, arguments);
    fn.apply(null, arguments);
    return returnValue;
  };
};

/**
 * Calls all the trigger methods if the URI has changed.
 */
var callTriggersIfURIChanged = debounce(function() {
  var uri = window.location.href;
  if (lastURI !== uri) {
    var pseudoEvent = {
      type: 'locationchange',
      target: document
    };

    triggers.forEach(function(trigger) {
      trigger(pseudoEvent, document);
    });

    lastURI = uri;
  }
}, 0);

/**
 * Starts watching for location changes.
 */
var watchForLocationChange = once(function() {
  if (history) {
    if (history.pushState) {
      callThrough(history, 'pushState', callTriggersIfURIChanged);
    }

    if (history.replaceState) {
      callThrough(history, 'replaceState', callTriggersIfURIChanged);
    }
  }

  window.addEventListener('popstate', callTriggersIfURIChanged);
  window.addEventListener('hashchange', callTriggersIfURIChanged);
});

/**
 * Location change event. This event occurs when the URL hash is changed or the URL is changed
 * through the <code>history</code> API.
 * @param {Object} config The event config object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  watchForLocationChange();
  triggers.push(trigger);
};
