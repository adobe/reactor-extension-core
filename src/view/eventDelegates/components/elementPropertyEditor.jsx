import React from 'react';
import Coral from '@coralui/coralui-support-react';
import RegexToggle from '../../components/regexToggle';
import { ValidationWrapper } from '@reactor/react-components';

export default class ElementPropertyEditor extends React.Component {
  remove = () => {
    this.props.remove();
  };
  render() {
    const { removable } = this.props;
    const { name, value, valueIsRegex } = this.props.fields;

    var removeButton;
    if (removable) {
      removeButton = (
        <Coral.Button
          ref="removeButton"
          className="u-gapBottom"
          variant="quiet"
          icon="close"
          iconsize="S"
          onClick={this.remove}/>
      );
    }
    return (
      <div className="u-gapBottom">
        <ValidationWrapper
          ref="nameValidationWrapper"
          error={name.touched && name.error}>
          <Coral.Textfield
            ref="nameField"
            placeholder="Property"
            onKeyPress={this.props.onKeyPress}
            {...name}/>
        </ValidationWrapper>
        <span className="u-label u-gapLeft">=</span>
        <Coral.Textfield
          ref="valueField"
          className="u-gapRight"
          placeholder="Value"
          onKeyPress={this.props.onKeyPress}
          {...value}/>
        <RegexToggle
          ref="regexToggle"
          value={value.value}
          valueIsRegex={valueIsRegex.value}
          onValueChange={value.onChange}
          onValueIsRegexChange={valueIsRegex.onChange}/>
        {removeButton}
      </div>
    );
  }
}
