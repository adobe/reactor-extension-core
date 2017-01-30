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
