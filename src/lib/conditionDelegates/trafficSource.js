'use strict';

var extension = require('get-extension')('dtm');
var textMatch = extension.getResource('text-match');
var visitorTracking = extension.getResource('visitor-tracking');

// Visitor tracking should only run (be enabled) when a rule for the property contains a condition
// that needs it. The line below will be included in the emitted library if a rule requires this
// condition and it will be run regardless of whether the condition ever gets evaluated.
visitorTracking.enable();

/**
 * Traffic source condition. Determines if the actual traffic source matches an acceptable traffic
 * source.
 * @param {Object} settings Condition settings.
 * @param {string} settings.source An acceptable traffic source.
 * @param {boolean} [settings.sourceIsRegex=false] Whether <code>settings.source</code> is intended
 * to be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var acceptableSource =
    settings.sourceIsRegex ? new RegExp(settings.source, 'i') : settings.source;
  return textMatch(visitorTracking.getTrafficSource(), acceptableSource);
};

