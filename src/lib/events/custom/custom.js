'use strict';

var bubbly = require('resourceProvider').get('dtm', 'createBubbly')();

var typesWatched = [];

/**
 * The custom event. When an event is seen with the specified type, the rule will be executed.
 * @param {Object} config The event config object.
 * @param {string} config.selector The CSS selector for elements the rule is targeting.
 * @param {string} config.type The custom event type.
 * @param {Object} [config.elementProperties] Property names and values the element must have in
 * order for the rule to fire.
 * @param {boolean} [config.bubbleFireIfParent=false] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [config.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  var type = config.type;

  if (typesWatched.indexOf(type) === -1) {
    typesWatched.push(type);
    document.addEventListener(type, bubbly.evaluateEvent, true);
  }

  bubbly.addListener(config, trigger);
};
