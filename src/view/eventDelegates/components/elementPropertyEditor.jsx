import React from 'react';
import Coral from 'coralui-support-react';
import RegexToggle from '../../components/regexToggle';
import { connect } from 'react-redux';

export default class ElementPropertyEditor extends React.Component {
  remove = () => {
    this.props.remove();
  };

  onNameChange = event => {
    this.props.setName(event.target.value);
  };

  onValueChange = event => {
    this.props.setValue(event.target.value);
  };

  setValueIsRegex = isRegex => {
    this.props.setValueIsRegex(isRegex);
  };

  render() {
    var removeButton;

    if (this.props.removable) {
      removeButton = (
        <Coral.Button
          ref="removeButton"
          variant="quiet"
          icon="close"
          iconsize="XS"
          onClick={this.remove}/>
      );
    }

    return (
      <div className="u-gapBottom">
        <Coral.Textfield 
          className="u-gapRight"
          placeholder="Property" 
          value={this.props.name}
          onChange={this.onNameChange}/>
        <span className="u-label">=</span>
        <Coral.Textfield 
          className="u-gapRight"
          placeholder="Value" 
          value={this.props.value}
          onChange={this.onValueChange}/>
        <RegexToggle
          value={this.props.value}
          valueIsRegex={this.props.valueIsRegex}
          setValue={this.props.setValue}
          setValueIsRegex={this.setValueIsRegex}/>
        {removeButton}
      </div>
    )
  }
}
