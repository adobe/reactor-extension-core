import React from 'react';
import Coral from 'coralui-support-react';
import store from '../store';

export default React.createClass({
  getInitialState: function() {
    return {
      config: store.getConfig()
    };
  },

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
  },

  handleChange: function(event) {
    this.state.config.selector = event.target.value;
    this.onStoreUpdate(this.state.config);
  },

  render: function() {
    return (
      <label>
        <span className="ElementSelectorField-label">on element matching</span>
        <Coral.Textfield
          placeholder="CSS Selector"
          className="u-gapRight"
          value={this.state.config.selector}
          onChange={this.handleChange}/>
      </label>
    );
  }
});
