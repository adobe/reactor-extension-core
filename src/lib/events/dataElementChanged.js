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
