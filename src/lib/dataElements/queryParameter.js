'use strict';

var getQueryParam = require('@turbine/get-query-param');

/**
 * The query parameter data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.name The query parameter name.
 * @param {string} [settings.caseInsensitive] Whether casing should be ignored.
 * @returns {string}
 */
module.exports = function(settings) {
  return getQueryParam(settings.name, settings.caseInsensitive || false);
};
