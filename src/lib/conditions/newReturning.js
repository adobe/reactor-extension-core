'use strict';
var visitorTracking = require('../helpers/visitorTracking');

// Visitor tracking should only run (be enabled) when a rule for the property contains a condition
// that needs it. The line below will be included in the emitted library if a rule requires this
// condition and it will be run regardless of whether the condition ever gets evaluated.
visitorTracking.enable();

/**
 * New vs. returning visitor condition. Determines if the visitor is a new or returning visitor.
 * @param {Object} settings Condition settings.
 * @param {boolean} settings.isNewVisitor When true, the condition returns true if the
 * visitor is a new visitor. When false, the condition returns true if the visitor is a returning
 * visitor.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var isNewVisitor = visitorTracking.getIsNewVisitor();
  return settings.isNewVisitor ? isNewVisitor : !isNewVisitor;
};

