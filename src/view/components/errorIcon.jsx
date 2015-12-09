import React from 'react';
import Coral from 'coralui-support-react';

export default class ErrorIcon extends React.Component {
  render() {
    return (
      <div className="ErrorIcon">
        <Coral.Icon class="u-gapLeft ErrorIcon-icon" size="S" icon="alert" />
        <Coral.Tooltip
          target="_prev"
          placement="bottom"
          offset="18"
          variant="error"
          open={this.props.openTooltip}>{this.props.message}</Coral.Tooltip>
      </div>
    );
  }
}
