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

var getDataElementValue = require('@turbine/get-data-element-value');

var POLL_INTERVAL = 1000;

var triggersByName = {};
var cachedStringifiedValueByName = {};

setInterval(function() {
  Object.keys(triggersByName).forEach(function(name) {
    var stringifiedValue = JSON.stringify(getDataElementValue(name));

    if (stringifiedValue !== cachedStringifiedValueByName[name]) {
      var pseudoEvent = {
        type: 'dataelementchange(' + name + ')',
        target: document
      };

      triggersByName[name].forEach(function(trigger) {
        trigger(document, pseudoEvent);
      });

      cachedStringifiedValueByName[name] = stringifiedValue;
    }
  });
}, POLL_INTERVAL);

module.exports = function(settings, trigger) {
  var name = settings.name;
  var triggers = triggersByName[name];

  if (!triggers) {
    triggers = triggersByName[name] = [];
    cachedStringifiedValueByName[name] = JSON.stringify(getDataElementValue(name));
  }

  triggers.push(trigger);
};
