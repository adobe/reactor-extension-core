'use strict';

/**
 * Stubs publicRequire. Resources are typically initialized during the engine bootstrap process.
 * Since most of our tests don't run the bootstrap process, this allows us to simulate that portion
 * of the process and create a publicRequire function that behaves similar to the real one. For
 * anything that is not an extension resource, this delegates to the real publicRequire.
 * @param [config]
 * @param {Object} [config.propertyConfig] Property configuration.
 * @param {Object} [config.resourceStubs] Resource stubs. The key is the qualified ID
 * (dtm.fooResource) and the value is the resource that should be provided when requested.
 * @returns {Function}
 */
module.exports = function(config) {
  var publicRequire;
  var resources = {};

  var publicRequireInjector =
    require('inject?./state!@reactor/turbine/src/publicRequire');
  publicRequire = publicRequireInjector({
    './state': {
      getExtension: function(extensionName) {
        return {
          getResource: function(resourceName) {
            var uniqueId = extensionName + '/resources/' + resourceName;
            if (config && config.resourceStubs && config.resourceStubs[uniqueId]) {
              return config.resourceStubs[uniqueId];
            } else {
              return resources[uniqueId];
            }
          }
        };
      },
      getPropertyConfig: function() {
        return config && config.propertyConfig ? config.propertyConfig : {};
      }
    }
  });

  var getObjectProperty = require('../../resources/getObjectProperty');
  resources['dtm/resources/get-object-property'] = getObjectProperty;

  var textMatch = require('../../resources/textMatch');
  resources['dtm/resources/text-match'] = textMatch;

  var matchesSelector = require('../../resources/matchesSelector');
  resources['dtm/resources/matches-selector'] = matchesSelector;

  var timerInjector = require('inject!../../resources/timer');
  var Timer = timerInjector({
    'event-emitter': publicRequire('event-emitter')
  });
  resources['dtm/resources/timer'] = Timer;

  var visibilityApi = require('../../resources/visibilityApi');
  resources['dtm/resources/visibility-api'] = visibilityApi;

  var liveQuerySelectorInjector =
    require('inject!../../resources/liveQuerySelector');
  var liveQuerySelector = liveQuerySelectorInjector({
    'once': publicRequire('once'),
    'create-data-stash': publicRequire('create-data-stash'),
    'get-extension': publicRequire('get-extension')
  });
  resources['dtm/resources/live-query-selector'] = liveQuerySelector;

  var matchesPropertiesInjector =
    require('inject!../../resources/matchesProperties');
  var matchesProperties = matchesPropertiesInjector({
    'get-extension': publicRequire('get-extension')
  });
  resources['dtm/resources/matches-properties'] = matchesProperties;

  var createBubblyInjector = require('inject!../../resources/createBubbly');
  var createBubbly = createBubblyInjector({
    'create-data-stash': publicRequire('create-data-stash'),
    'get-extension': publicRequire('get-extension')
  });
  resources['dtm/resources/create-bubbly'] = createBubbly;

  var compareNumbers = require('../../resources/compareNumbers');
  resources['dtm/resources/compare-numbers'] = compareNumbers;

  var visitorTrackingInjector =
    require('inject!../../resources/visitorTracking');
  var visitorTracking = visitorTrackingInjector({
    'get-cookie': publicRequire('get-cookie'),
    'set-cookie': publicRequire('set-cookie'),
    'document': publicRequire('document'),
    'window': publicRequire('window'),
    'property-config': publicRequire('property-config')
  });
  resources['dtm/resources/visitor-tracking'] = visitorTracking;

  return publicRequire;
};
