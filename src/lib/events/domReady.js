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

var once = require('@turbine/once');

var triggers = [];

var handleDOMContentLoaded = function() {
  document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded, true);

  triggers.forEach(function(trigger) {
    var pseudoEvent = {
      type: 'domready',
      target: document.location
    };

    trigger(document.location, pseudoEvent);
  });
};

var watchForContentLoaded  = once(function() {
  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded, true);
});

/**
 * DOM ready event. This event occurs as soon as HTML document has been completely loaded and
 * parsed, without waiting for stylesheets, images, and subframes to finish loading.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  watchForContentLoaded();
  triggers.push(trigger);
};
