'use strict';

var textMatch = require('textMatch');
var visitorTracking = require('resourceProvider').get('dtm', 'visitorTracking');

/**
 * Traffic source condition. Determines if the actual traffic source matches an acceptable traffic
 * source.
 * @param {Object} config Condition config.
 * @param {(RegEx|string)} config.source An acceptable traffic source.
 * @returns {boolean}
 */
module.exports = function(config) {
  var source = visitorTracking.getTrafficSource();
  return textMatch(source, config.source);
};

