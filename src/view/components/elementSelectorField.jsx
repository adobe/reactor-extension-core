import React from 'react';
import Coral from 'coralui-support-react';

export default React.createClass({
  render: function() {
    return (
      <label>
        <span className="ElementSelectorField-label">on element matching</span>
        <Coral.Textfield placeholder="CSS Selector" className="u-gapRight" onChange={this.onSelectorChange}/>
      </label>
    );
  }
});
