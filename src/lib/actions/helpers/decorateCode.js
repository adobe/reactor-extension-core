'use strict';

var replaceTokens = require('replace-tokens');
var id = 0;

var isSourceLoadedFromFile = function(action) {
  return action.settings.hasOwnProperty('sourceUrl');
};

var decorateGlobalJavaScriptCode = function(action, source) {
  return '<scr' + 'ipt>' + source + '</scr' + 'ipt>';
};

var decorateNonGlobalJavaScriptCode = function(action, source) {
  var runScriptFnName = '__runScript' + ++id;

  _satellite[runScriptFnName] = function(fn) {
    fn(action.event, action.relatedElement);
    delete _satellite[runScriptFnName];
  };

  return '<scr' + 'ipt>_satellite["' + runScriptFnName + '"](function(event, target) {' +
    source +
    '});</scr' + 'ipt>';
};

var decorators = {
  javascript: function(action, source) {
    return action.settings.global ?
      decorateGlobalJavaScriptCode(action, source) :
      decorateNonGlobalJavaScriptCode(action, source);
  },
  html: function(action, source) {
    // We need to replace tokens only for sources loaded from external files. The sources from
    // inside the container are automatically taken care by Turbine.
    if (isSourceLoadedFromFile(action)) {
      return replaceTokens(source, action.relatedElement, action.event);
    }

    return source;
  }
};

module.exports = function(action, source) {
  return decorators[action.settings.language](action, source);
};
