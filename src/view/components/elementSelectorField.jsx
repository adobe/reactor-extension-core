import React from 'react';
import Coral from 'coralui-support-react';
import {config} from '../store/config';

export default React.createClass({
  onSelectorChange: function(event) {
    config.selector = event.target.value;
  },
  render: function() {
    return (
      <label>
        <span className="ElementSelectorField-label">on element matching</span>
        <Coral.Textfield
          placeholder="CSS Selector"
          className="u-gapRight"
          defaultValue={config.selector}
          coral-onChange={this.onSelectorChange}/>
      </label>
    );
  }
});
