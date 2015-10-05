'use strict';

/**
 * Stubs publicRequire. Resources are typically initialized during the engine bootstrap process.
 * Since most of our tests don't run the bootstrap process, this allows us to simulate that portion
 * of the process and create a publicRequire function that behaves similar to the real one. For
 * anything that is not an extension resource, this delegates to the real publicRequire.
 * @param [config]
 * @param {Object} [config.property] Property configuration.
 * @param {Object} [config.resourceStubs] Resource stubs. The key is the qualified ID
 * (dtm/fooResource) and the value is the resource that should be provided when requested.
 * @returns {Function}
 */
module.exports = function(config) {
  var publicRequire;
  var resources = {};

  var publicRequireInjector = require('inject?./state!../../../node_modules/turbine/src/publicRequire');
  publicRequire = publicRequireInjector({
    './state': {
      getResource: function(resourceId) {
        if (config && config.resourceStubs && config.resourceStubs[resourceId]) {
          return config.resourceStubs[resourceId];
        } else {
          return resources[resourceId];
        }
      },
      getPropertyConfig: function() {
        return config && config.property ? config.property : {};
      }
    }
  });

  var matchesPropertiesInjector =
    require('inject!../../resources/matchesProperties/matchesProperties');
  var matchesProperties = matchesPropertiesInjector({
    textMatch: publicRequire('textMatch')
  });
  resources['dtm/matchesProperties'] = matchesProperties;

  var createBubblyInjector = require('inject!../../resources/createBubbly/createBubbly');
  var createBubbly = createBubblyInjector({
    createDataStash: publicRequire('createDataStash'),
    matchesSelector: publicRequire('matchesSelector'),
    resourceProvider: publicRequire('resourceProvider')
  });
  resources['dtm/createBubbly'] = createBubbly;

  var compareNumbers = require('../../resources/compareNumbers/compareNumbers');
  resources['dtm/compareNumbers'] = compareNumbers;

  var visitorTrackingInjector =
    require('inject!../../resources/visitorTracking/visitorTracking');
  var visitorTracking = visitorTrackingInjector({
    'getCookie': publicRequire('getCookie'),
    'setCookie': publicRequire('setCookie'),
    'document': publicRequire('document'),
    'window': publicRequire('window'),
    'property': publicRequire('property')
  });
  resources['dtm/visitorTracking'] = visitorTracking;

  return publicRequire;
};
