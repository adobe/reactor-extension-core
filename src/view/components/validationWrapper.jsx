import React from 'react';
import Coral from 'coralui-support-react';
import ErrorIcon from './errorIcon';

export default React.createClass({
  getInitialState: function() {
    return {
      openTooltip: false
    }
  },
  onFocus: function() {
    this.setState({
      openTooltip: true
    });
  },
  onBlur: function() {
    this.setState({
      openTooltip: false
    });
  },
  render: function() {
    let invalidIcon;

    if (this.props.error) {
      invalidIcon = <ErrorIcon message={this.props.error} openTooltip={this.state.openTooltip}/>;
    }

    let children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, { invalid: this.props.error ? true : null })
    });

    return (
      <div className="ValidationWrapper" onFocus={this.onFocus} onBlur={this.onBlur}>
        {children}
        {invalidIcon}
      </div>
    );
  }
});
