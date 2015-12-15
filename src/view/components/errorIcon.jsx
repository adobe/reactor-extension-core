import React from 'react';
import Coral from 'coralui-support-react';

export default class ErrorIcon extends React.Component {
  constructor() {
    super();
    this.state = {
      mouseOverIcon: false
    };
  }

  onMouseEnter = () => {
    this.setState({
      mouseOverIcon: true
    });
  };

  onMouseLeave = () => {
    this.setState({
      mouseOverIcon: false
    });
  };

  render() {
    return (
      <div className="ErrorIcon">
        <Coral.Icon
          className="u-gapLeft ErrorIcon-icon"
          size="S"
          icon="alert"
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}/>
        <Coral.Tooltip
          target="_prev"
          placement="bottom"
          offset="18"
          variant="error"
          interaction="off"
          open={this.props.openTooltip || this.state.mouseOverIcon}>{this.props.message}</Coral.Tooltip>
      </div>
    );
  }
}
