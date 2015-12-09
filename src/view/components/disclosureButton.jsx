import React from 'react';
import Coral from 'coralui-support-react';

export default class DisclosureButton extends React.Component {
  onClick = event => {
    this.props.setSelected(!this.props.selected);
  };

  render() {
    var iconClass = this.props.selected ? 'chevronDown' : 'chevronRight';

    return (
      <button className="u-buttonReset" onClick={this.onClick}>
        {this.props.label}
        <Coral.Icon class="DisclosureButton-icon" icon={iconClass}/>
      </button>
    );
  }
}
