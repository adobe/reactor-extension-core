'use strict';

var textMatch = require('textMatch');
var visitorTracking = require('resourceProvider').get('dtm', 'visitorTracking');

/**
 * Traffic source condition. Determines if the actual traffic source matches an acceptable traffic
 * source.
 * @param {Object} config Condition config.
 * @param {string} config.source An acceptable traffic source.
 * @param {boolean} [config.sourceIsRegex=false] Whether <code>config.source</code> is intended to
 * be a regular expression.
 * @returns {boolean}
 */
module.exports = function(config) {
  var acceptableSource = config.sourceIsRegex ? new RegExp(config.source, 'i') : config.source;
  return textMatch(visitorTracking.getTrafficSource(), acceptableSource);
};

