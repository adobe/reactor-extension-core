'use strict';

var visitorTracking = require('./helpers/visitorTracking');
var textMatch = require('../helpers/textMatch');

// Visitor tracking should only run (be enabled) when a rule for the property contains a condition
// that needs it. The line below will be included in the emitted library if a rule requires this
// condition and it will be run regardless of whether the condition ever gets evaluated.
visitorTracking.enable();

/**
 * Landing page condition. Determines if the actual landing page matches an acceptable landing page.
 * @param {Object} settings Condition settings.
 * @param {string} settings.page An acceptable landing page.
 * @param {boolean} [settings.pageIsRegex=false] Whether <code>settings.page</code> is intended to
 * be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var acceptablePage = settings.pageIsRegex ? new RegExp(settings.page, 'i') : settings.page;
  return textMatch(visitorTracking.getLandingPage(), acceptablePage);
};

