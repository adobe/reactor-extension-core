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

/**
 * Custom code event. This executes event code provided by the user. The user's code will call
 * <code>trigger</code> when the rule should fire.
 * @param {Object} settings The event settings object.
 * @param {Function} settings.source The custom script function.
 */
module.exports = function(settings, trigger) {
  // We're reluctant to expose the trigger function coming from Turbine directly to the user because
  // it accepts arguments that we're not sure we want to support for this use case.
  settings.source(function() {
    trigger();
  });
};
