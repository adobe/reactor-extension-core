import store from '../store';

var ConfigComponentMixin = {
  // Start every component out with an empty config object. Note
  //config: {},

  componentWillMount: function() {
    store.register(this._onStoreUpdate);
    this.config = store.getConfig();
  },

  componentWillUnmount: function() {
    store.unregister(this._onStoreUpdate);
  },

  _onStoreUpdate: function(config) {
    this.config = config;
    if (this.onStoreUpdate) {
      this.onStoreUpdate(config);
    }
  }
};

export default ConfigComponentMixin;
