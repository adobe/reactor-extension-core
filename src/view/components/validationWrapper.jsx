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

  recursiveCloneWithInvalidProp(children) {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        let childProps = { invalid: Boolean(this.props.error) };
        childProps.children = this.recursiveCloneWithInvalidProp(child.props.children);
        return React.cloneElement(child, childProps);
      } else {
        return child;
      }
    })
  }

  render() {
    let invalidIcon;

    if (this.props.error) {
      invalidIcon = <ErrorIcon message={this.props.error} openTooltip={this.state.openTooltip}/>;
    }

    let children = this.recursiveCloneWithInvalidProp(this.props.children);

    return (
      <div className="ValidationWrapper" onFocus={this.onFocus} onBlur={this.onBlur}>
        {children}
        {invalidIcon}
      </div>
    );
  }
}
