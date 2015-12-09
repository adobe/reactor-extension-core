import React from 'react';
import Coral from 'coralui-support-react';
import ErrorIcon from './errorIcon';

export default class ValidationWrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      openTooltip: false
    }
  }

  onFocus = () => {
    this.setState({
      openTooltip: true
    });
  };

  onBlur = () => {
    this.setState({
      openTooltip: false
    });
  };

  render() {
    let invalidIcon;

    if (this.props.error) {
      invalidIcon = <ErrorIcon message={this.props.error} openTooltip={this.props.openTooltip}/>;
    }

    let children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, { invalid: this.props.error })
    });

    return (
      <div className="ValidationWrapper" onFocus={this.onFocus} onBlur={this.onBlur}>
        {children}
        {invalidIcon}
      </div>
    );
  }
}
