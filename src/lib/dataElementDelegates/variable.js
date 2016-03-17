'use strict';
var window = require('window');

var extension = require('get-extension')('dtm');
var getObjectProperty = extension.getHelper('get-object-property');

/**
 * The variable data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.path The global path to the variable holding the data element value.
 * @returns {string}
 */
module.exports = function(settings) {
  return getObjectProperty(window, settings.path);
};
