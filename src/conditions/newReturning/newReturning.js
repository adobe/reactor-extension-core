'use strict';

var visitorTracking = require('resourceProvider').get('dtm', 'visitorTracking');

/**
 * New vs. returning visitor condition. Determines if the visitor is a new or returning visitor.
 * @param {Object} config Condition config.
 * @param {string} config.isNew When true, the condition returns true if the
 * visitor is a new visitor. When false, the condition returns true if the visitor is a returning
 * visitor.
 * @returns {boolean}
 */
module.exports = function(config) {
  var isNewVisitor = visitorTracking.getIsNewVisitor();
  return config.isNew ? isNewVisitor : !isNewVisitor;
};

