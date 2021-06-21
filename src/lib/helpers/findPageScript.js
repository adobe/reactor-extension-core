'use strict';

var document = require('@adobe/reactor-document');

var byRegexPattern = function (regexScriptSrcPattern) {
  var scripts = document.querySelectorAll('script');

  for (var i = 0; i < scripts.length; i++) {
    var script = scripts[i];
    // Find the script that loaded our library. Take into account embed scripts migrated
    // from DTM. We'll also consider that they may have added a querystring for cache-busting
    // or whatever.
    if (regexScriptSrcPattern.test(script.src)) {
      return script;
    }
  }
};

var getTurbine = function () {
  return byRegexPattern(new RegExp(/(launch|satelliteLib)-[^\/]+.js(\?.*)?$/));
};

module.exports = {
  getTurbine: getTurbine,
  byRegexPattern: byRegexPattern
};
