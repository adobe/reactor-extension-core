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

var container = _satellite.container;

container.extensions = {
  testExtension: {
    name: 'Test Extension'
  }
};

container.actionDelegates = {
  test: function(module) {
    module.exports = function() {};
  }
};

container.rules = [];

/**
 * Configures an action for the engine for testing event delegates. Calling this multiple
 * times will override settings made by previous calls.
 * @param {Function} actionSpy An action spy. This will be called if a configured rule is triggered
 * and passes conditions.
 */
window.configureActionForEventTests = function(actionSpy) {
  container.actionDelegates.test = function(module) {
    module.exports = actionSpy;
  };
};

/**
 * Configures a rule for the engine for testing event delegates. Can be called multiple times to
 * set up multiple rules.
 * @param {Array} events An array of event settings objects for the rule.
 * @param {Function} [conditionSpy] A condition spy.
 */
window.configureRuleForEventTests = function(events, conditionSpy) {
  container.rules.push({
    events: events, // This will vary amongst tests.
    conditions: [
      {
        type: 'dtm.custom',
        settings: {
          script: conditionSpy || function() {
            return true;
          }
        }
      }
    ],
    actions: [
      {
        type: 'test'
      }
    ]
  });
};
