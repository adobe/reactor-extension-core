'use strict';
var loadScript = require('@turbine/load-script');
var Promise = require('@turbine/promise');

var codeBySourceUrl = {};
var scriptStore = {};

var loadScriptOnlyOnce = function(url) {
  if (!scriptStore[url]) {
    scriptStore[url] = loadScript(url);
  }

  return scriptStore[url];
};

_satellite.__registerScript = function(sourceUrl, code) {
  codeBySourceUrl[sourceUrl] = code;
};

module.exports = function(sourceUrl) {
  if (codeBySourceUrl[sourceUrl]) {
    return Promise.resolve(codeBySourceUrl[sourceUrl]);
  } else {
    return new Promise(function(resolve) {
      loadScriptOnlyOnce(sourceUrl).then(function() {
        resolve(codeBySourceUrl[sourceUrl]);
      }, function() {
        resolve();
      });
    });
  }
};
