import React from 'react';
import Coral from 'coralui-support-react';
import RegexToggle from '../../components/regexToggle';
import ValidationWrapper from '../../components/validationWrapper';

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
          variant="quiet"
          icon="close"
          iconsize="XS"
          onClick={this.remove}/>
      );
    }
    return (
      <div className="u-gapBottom">
        <ValidationWrapper
          ref="nameValidationWrapper"
          error={name.touched && name.error}>
          <Coral.Textfield
            placeholder="Property"
            {...name}/>
        </ValidationWrapper>
        <span className="u-label u-gapLeft">=</span>
        <Coral.Textfield
          ref="valueField"
          className="u-gapRight"
          placeholder="Value"
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
