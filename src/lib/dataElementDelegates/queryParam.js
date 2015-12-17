'use strict';

var getQueryParam = require('getQueryParam');

module.exports = function(config) {
  return getQueryParam(config.name, config.ignoreCase);
};
