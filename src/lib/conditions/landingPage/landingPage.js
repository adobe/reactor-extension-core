'use strict';

var textMatch = require('textMatch');
var visitorTracking = require('resourceProvider').get('dtm', 'visitorTracking');

/**
 * Landing page condition. Determines if the actual landing page matches an acceptable landing page.
 * @param {Object} config Condition config.
 * @param {(RegEx|string)} config.page An acceptable landing page.
 * @returns {boolean}
 */
module.exports = function(config) {
  var landingPage = visitorTracking.getLandingPage();
  return textMatch(landingPage, config.page);
};

