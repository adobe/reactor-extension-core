'use strict';

var getObjectProperty = require('getObjectProperty');

module.exports = function(config) {
  return getObjectProperty(window, config.path);
};
