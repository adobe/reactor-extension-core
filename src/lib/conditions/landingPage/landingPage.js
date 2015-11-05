'use strict';

var textMatch = require('textMatch');
var visitorTracking = require('resourceProvider').get('dtm', 'visitorTracking');

/**
 * Landing page condition. Determines if the actual landing page matches an acceptable landing page.
 * @param {Object} config Condition config.
 * @param {string} config.page An acceptable landing page.
 * @param {boolean} [config.pageIsRegex=false] Whether <code>config.page</code> is intended to be
 * a regular expression.
 * @returns {boolean}
 */
module.exports = function(config) {
  var acceptablePage = config.pageIsRegex ? new RegExp(config.page, 'i') : config.page;
  return textMatch(visitorTracking.getLandingPage(), acceptablePage);
};

