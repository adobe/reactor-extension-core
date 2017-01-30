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

var document = require('@turbine/document');
var writeHtml = require('@turbine/write-html');
var Promise = require('@turbine/promise');
var logger = require('@turbine/logger');
var decorateCode = require('./helpers/decorateCode');
var loadCodeSequentially = require('./helpers/loadCodeSequentially');
var postscribe = require('../../../node_modules/postscribe/dist/postscribe');

var writeToDocument = writeHtml;
document.addEventListener('DOMContentLoaded', function() {
  writeToDocument = function(source) {
    postscribe(document.body, source, {
      error: function(error) {
        logger.error(error.message);
      }
    });
  };
});

/**
 * The custom action event. This loads and executes custom JavaScript or HTML provided by the user.
 * @param {Object} settings Action settings.
 * @param {number} settings.name The name of the action. Typically used by users to remind
 * themselves what the code is intended to do.
 * @param {string} settings.source If <code>settings.language</code> is <code>html</code> and
 * <code>settings.sequential</code> is <code>true</code>, then this will be the user's code.
 * Otherwise, it will be a relative path to the file containing the users code.
 * @param {string} settings.language The language of the user's code. Must be either
 * <code>javascript</code> or <code>html</code>.
 */
module.exports = function(settings, relatedElement, event) {
  var action = {
    settings: settings,
    relatedElement: relatedElement,
    event: event
  };

  return Promise.resolve(
    action.settings.isExternal ?
      loadCodeSequentially(action.settings.source) :
      action.settings.source
  ).then(function(source) {
    if (source) {
      writeToDocument(decorateCode(action, source));
    }
  });
};
