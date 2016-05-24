'use strict';

/**
 * The custom data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.script The function that should be called which will return a value.
 * @returns {string}
 */
module.exports = function(settings) {
  return settings.script();
};
