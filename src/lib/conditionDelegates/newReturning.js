'use strict';

var visitorTracking = require('getResource')('dtm', 'visitorTracking');

// Visitor tracking should only run (be enabled) when a rule for the property contains a condition
// that needs it. The line below will be included in the emitted library if a rule requires this
// condition and it will be run regardless of whether the condition ever gets evaluated.
visitorTracking.enable();

/**
 * New vs. returning visitor condition. Determines if the visitor is a new or returning visitor.
 * @param {Object} config Condition config.
 * @param {boolean} config.isNewVisitor When true, the condition returns true if the
 * visitor is a new visitor. When false, the condition returns true if the visitor is a returning
 * visitor.
 * @returns {boolean}
 */
module.exports = function(config) {
  var isNewVisitor = visitorTracking.getIsNewVisitor();
  return config.isNewVisitor ? isNewVisitor : !isNewVisitor;
};

