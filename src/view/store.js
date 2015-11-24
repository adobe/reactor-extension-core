var listeners = [];
var config = {};

module.exports = {
  register: function(listener) {
    listeners.push(listener);
  },

  unregister: function(listener) {
    listeners.splice(listeners.indexOf(listener), 1);
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
