import React from 'react';
import Coral from 'coralui-support-react';

export default React.createClass({
  render: function() {
    return (
      <div className="ErrorIcon">
        <Coral.Icon class="u-gapLeft ErrorIcon-icon" size="S" icon="alert" />
        <Coral.Tooltip
          target="_prev"
          placement="bottom"
          offset="18"
          variant="error"
          open={this.props.openTooltip ? true : null}>{this.props.message}</Coral.Tooltip>
      </div>
    );
  }
});
