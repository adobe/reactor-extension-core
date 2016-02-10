'use strict';

module.exports = function() {
  var properties = {
    'hidden': 'visibilitychange',
    'mozHidden': 'mozvisibilitychange',
    'msHidden': 'msvisibilitychange',
    'webkitHidden': 'webkitvisibilitychange'
  };

  for (var key in properties) {
    if (properties.hasOwnProperty(key) && typeof document[key] !== 'undefined') {
      return {
        hiddenProperty: key,
        visibilityChangeEventType: properties[key]
      };
    }
  }
};
