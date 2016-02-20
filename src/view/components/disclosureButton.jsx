import React from 'react';
import Coral from 'coralui-support-react';

export default class DisclosureButton extends React.Component {
  render() {
    var iconClass = this.props.selected ? 'chevronDown' : 'chevronRight';

    return (
      <button ref="button" className="u-buttonReset" onClick={this.props.onClick}>
        <Coral.Icon ref="icon" className="DisclosureButton-icon u-gapRight" icon={iconClass}/>
        {this.props.label}
      </button>
    );
  }
}
