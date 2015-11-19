import React from 'react';
import Coral from 'coralui-support-react';

export default React.createClass({
  onClick: function() {
    this.props.setSelected(!this.props.selected);
  },
  render: function() {
    var iconClass = this.props.selected ? 'chevronUp' : 'chevronDown';

    return (
      <button className="u-buttonReset" onClick={this.onClick}>{this.props.label}<Coral.Icon class="DisclosureButton-icon" icon={iconClass}/></button>
    );
  }
});
