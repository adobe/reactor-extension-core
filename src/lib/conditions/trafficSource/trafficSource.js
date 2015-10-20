'use strict';

var textMatch = require('textMatch');
var visitorTracking = require('resourceProvider').get('dtm', 'visitorTracking');

/**
 * Traffic source condition. Determines if the actual traffic source matches at least one
 * acceptable traffic source.
 * @param {Object} config Condition config.
 * @param {(RegEx|string)[]} config.sources An array of traffic sources. The
 * condition will return true if the actual traffic source matches one of the sources in
 * the array.
 * @returns {boolean}
 */
module.exports = function(config) {
  var source = visitorTracking.getTrafficSource();
  return config.sources.some(function(sourceCriterion) {
    return textMatch(source, sourceCriterion);
  });
};

