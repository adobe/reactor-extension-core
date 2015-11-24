import React from 'react';
import Coral from 'coralui-support-react';
import store from '../store';
import ConfigComponentMixin from '../mixins/configComponentMixin';

export default React.createClass({
  mixins: [ConfigComponentMixin],

  getInitialState: function() {
    return {
      config: store.getConfig()
    };
  },

  handleChange: function(event) {
    this.state.config.selector = event.target.value;
    this.forceUpdate();
  },

  render: function() {
    return (
      <label>
        <span className="ElementSelectorField-label">matching</span>
        <Coral.Textfield
          placeholder="CSS Selector"
          className="u-gapRight"
          value={this.state.config.selector}
          onChange={this.handleChange}/>
      </label>
    );
  }
});
