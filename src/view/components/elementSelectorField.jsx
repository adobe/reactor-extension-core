import React from 'react';
import Coral from 'coralui-support-react';
import store from '../store';
import ConfigComponentMixin from '../mixins/configComponentMixin';

export default React.createClass({
  mixins: [ConfigComponentMixin],

  handleChange: function(event) {
    this.config.selector = event.target.value;
    this.forceUpdate();
  },

  render: function() {
    return (
      <label>
        <span className="u-italic u-gapRight">matching the CSS selector</span>
        <Coral.Textfield
          placeholder="CSS Selector"
          className="u-gapRight"
          value={this.config.selector}
          onChange={this.handleChange}/>
      </label>
    );
  }
});
