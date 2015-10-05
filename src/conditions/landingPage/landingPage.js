'use strict';

var textMatch = require('textMatch');
var visitorTracking = require('resourceProvider').get('dtm', 'visitorTracking');

/**
 * Landing page condition. Determines if the actual landing page matches at least one acceptable
 * landing page.
 * @param {Object} config Condition config.
 * @param {RegEx[]} config.pages An array of acceptable landing pages.
 * @returns {boolean}
 */
module.exports = function(config) {
  var landingPage = visitorTracking.getLandingPage();

  return config.pages.some(function(landingPageCriterion) {
    return textMatch(landingPage, landingPageCriterion);
  });
};

