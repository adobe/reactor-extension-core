import React from 'react';
import Coral from 'coralui-support-react';
import RegexToggle from '../../components/regexToggle';
import ValidationWrapper from '../../components/validationWrapper';

export default class ElementPropertyEditor extends React.Component {
  remove = () => {
    this.props.remove();
  };
  render() {
    const { name, value, valueIsRegex, removable } = this.props;
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
          ref="elementPropertyValidationWrapper"
          error={name.touched && name.error}>
          <Coral.Textfield
            className="u-gapLeft"
            placeholder="Property"
            {...name}/>
        </ValidationWrapper>
        <span className="u-label u-gapLeft">=</span>
        <Coral.Textfield
          className="u-gapRight"
          placeholder="Value"
          {...value}/>
        <RegexToggle
          value={value.value}
          valueIsRegex={valueIsRegex.value}
          onValueChange={value.onChange}
          onValueIsRegexChange={valueIsRegex.onChange}/>
        {removeButton}
      </div>
    );
  }
}
