/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

var replaceTokens = require('@turbine/replace-tokens');
var id = 0;

var isSourceLoadedFromFile = function(action) {
  return action.settings.isExternal;
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
