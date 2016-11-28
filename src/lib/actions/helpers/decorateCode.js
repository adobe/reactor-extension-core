'use strict';

var getVar = require('get-var');
var isVar = require('is-var');
var id = 0;

var replaceDataElementsTokens = function(action, source) {
  return source.replace(/%(.+?)%/g, function(token, tokenName) {
    if (isVar(tokenName)) {
      return getVar(tokenName, action.relatedElement, action.event);
    } else {
      return token;
    }
  });
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
    return replaceDataElementsTokens(action, source);
  }
};

module.exports = function(action, source) {
  return decorators[action.settings.language](action, source);
};
