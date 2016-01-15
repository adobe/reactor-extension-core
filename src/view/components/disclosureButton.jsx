import React from 'react';
import Coral from 'coralui-support-react';

export default class DisclosureButton extends React.Component {
  render() {
    var iconClass = this.props.selected ? 'chevronDown' : 'chevronRight';

    return (
      <button className="u-buttonReset" onClick={this.props.onClick}>
        {this.props.label}
        <Coral.Icon className="DisclosureButton-icon" icon={iconClass}/>
      </button>
    );
  }
}
