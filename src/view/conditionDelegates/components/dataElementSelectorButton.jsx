import React from 'react';
import Coral from 'coralui-support-react';

export default class DataElementSelectorButton extends React.Component {
  render() {
    return <Coral.Button
      ref="button"
      variant="quiet"
      icon="layers"
      iconSize="S"
      onClick={this.props.onClick}/>;
  }
}
