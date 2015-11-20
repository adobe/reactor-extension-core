import store from '../store';

var ConfigComponentMixin = {
  componentWillMount: function() {
    store.register(this.onStoreUpdate);
  },

  componentWillUnmount: function() {
    store.unregister(this.onStoreUpdate);
  },

  onStoreUpdate: function(config) {
    this.setState({
      config: config
    });

    if (this.onAfterStoreUpdate) {
      this.onAfterStoreUpdate(config);
    }
  }
};

export default ConfigComponentMixin;
