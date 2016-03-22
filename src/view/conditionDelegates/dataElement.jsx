import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper, DataElementField } from '@reactor/react-components';
import RegexToggle from '../components/regexToggle';

class DataElement extends React.Component {
  render() {
    const { name, value, valueIsRegex } = this.props.fields;

    return (
      <div>
        <ValidationWrapper
          ref="nameWrapper"
          className="u-gapRight"
          error={name.touched && name.error}>
          <label>
            <span className="u-label">Data element</span>
            <DataElementField ref="nameField" {...name}
              nameOnly="true"
              onOpenSelector={window.extensionBridge.openDataElementSelector}/>
          </label>
        </ValidationWrapper>
        <ValidationWrapper
          ref="valueWrapper"
          className="u-gapRight"
          error={value.touched && value.error}>
          <label>
            <span className="u-label">has the value</span>
            <Coral.Textfield ref="valueField" {...value}/>
          </label>
        </ValidationWrapper>
        <RegexToggle
          ref="valueRegexToggle"
          value={value.value}
          valueIsRegex={valueIsRegex.value}
          onValueChange={value.onChange}
          onValueIsRegexChange={valueIsRegex.onChange}/>
      </div>
    );
  }
}

const formConfig = {
  fields: [
    'name',
    'value',
    'valueIsRegex'
  ],
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.name) {
      errors.name = 'Please specify a data element.';
    }

    if (!values.value) {
      errors.value = 'Please specify a value.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(DataElement);
