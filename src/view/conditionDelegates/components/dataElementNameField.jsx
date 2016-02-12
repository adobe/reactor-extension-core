import React from 'react';
import Coral from 'coralui-support-react';
import DataElementSelectorButton from './dataElementSelectorButton';

export default class DataElementNameField extends React.Component {
  onClick = () => {
    window.extensionBridge.openDataElementSelector(this.props.onChange);
  };

  render() {
    return (
      <span>
        <Coral.Textfield
          ref="textfield"
          value={this.props.value}
          onClick={this.onClick}
          readOnly="true"
          invalid={this.props.invalid}/>
        <DataElementSelectorButton ref="button" onClick={this.onClick}/>
      </span>
    );
  }
}
