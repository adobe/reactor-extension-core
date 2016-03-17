'use strict';

/**
 * Stubs publicRequire. Helpers are typically initialized during the engine bootstrap process.
 * Since most of our tests don't run the bootstrap process, this allows us to simulate that portion
 * of the process and create a publicRequire function that behaves similar to the real one. For
 * anything that is not an extension helper, this delegates to the real publicRequire.
 * @param [config]
 * @param {Object} [config.propertySettings] Property settings.
 * @param {Object} [config.helperStubs] Helper stubs. The key is the qualified ID
 * (dtm.fooHelper) and the value is the helper that should be provided when requested.
 * @returns {Function}
 */
module.exports = function(config) {
  var publicRequire;
  var helpers = {};

  var publicRequireInjector =
    require('inject?./state!@reactor/turbine/src/publicRequire');
  publicRequire = publicRequireInjector({
    './state': {
      getExtension: function(extensionName) {
        return {
          getHelper: function(helperName) {
            var uniqueId = extensionName + '/helpers/' + helperName;
            if (config && config.helperStubs && config.helperStubs[uniqueId]) {
              return config.helperStubs[uniqueId];
            } else {
              return helpers[uniqueId];
            }
          }
        };
      },
      getPropertySettings: function() {
        return config && config.propertySettings ? config.propertySettings : {};
      }
    }
  });

  var getObjectProperty = require('../../helpers/getObjectProperty');
  helpers['dtm/helpers/get-object-property'] = getObjectProperty;

  var textMatch = require('../../helpers/textMatch');
  helpers['dtm/helpers/text-match'] = textMatch;

  var matchesSelector = require('../../helpers/matchesSelector');
  helpers['dtm/helpers/matches-selector'] = matchesSelector;

  var timerInjector = require('inject!../../helpers/timer');
  var Timer = timerInjector({
    'event-emitter': publicRequire('event-emitter')
  });
  helpers['dtm/helpers/timer'] = Timer;

  var visibilityApi = require('../../helpers/visibilityApi');
  helpers['dtm/helpers/visibility-api'] = visibilityApi;

  var liveQuerySelectorInjector =
    require('inject!../../helpers/liveQuerySelector');
  var liveQuerySelector = liveQuerySelectorInjector({
    'once': publicRequire('once'),
    'create-data-stash': publicRequire('create-data-stash'),
    'get-extension': publicRequire('get-extension')
  });
  helpers['dtm/helpers/live-query-selector'] = liveQuerySelector;

  var matchesPropertiesInjector =
    require('inject!../../helpers/matchesProperties');
  var matchesProperties = matchesPropertiesInjector({
    'get-extension': publicRequire('get-extension')
  });
  helpers['dtm/helpers/matches-properties'] = matchesProperties;

  var createBubblyInjector = require('inject!../../helpers/createBubbly');
  var createBubbly = createBubblyInjector({
    'create-data-stash': publicRequire('create-data-stash'),
    'get-extension': publicRequire('get-extension')
  });
  helpers['dtm/helpers/create-bubbly'] = createBubbly;

  var compareNumbers = require('../../helpers/compareNumbers');
  helpers['dtm/helpers/compare-numbers'] = compareNumbers;

  var visitorTrackingInjector =
    require('inject!../../helpers/visitorTracking');
  var visitorTracking = visitorTrackingInjector({
    'cookie': publicRequire('cookie'),
    'document': publicRequire('document'),
    'window': publicRequire('window'),
    'property-settings': publicRequire('property-settings')
  });
  helpers['dtm/helpers/visitor-tracking'] = visitorTracking;

  return publicRequire;
};
