var listeners = [];
var config = {};

module.exports = {
  register: function(listener) {
    if (listeners.indexOf(listener) === -1) {
      listeners.push(listener);
      listener(config);
    }
  },

  unregister: function(listener) {
    var index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  },

  getConfig: function() {
    return config;
  },

  setConfig: function(newConfig) {
    config = newConfig;

    listeners.forEach(function(listener) {
      listener(config);
    }, this);
  }
};
