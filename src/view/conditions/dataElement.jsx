import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';

import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';

class DataElement extends React.Component {
  onOpenDataElementSelector = () => {
    window.extensionBridge.openDataElementSelector(this.props.fields.name.onChange);
  };

  render() {
    const { name, value, valueIsRegex } = this.props.fields;

    return (
      <div>
        <ValidationWrapper
          type="name"
          className="u-gapRight"
          error={ name.touched && name.error }
        >
          <label>
            <span className="u-label">Data element</span>
            <Textfield { ...name } />
            <DataElementSelectorButton onClick={ this.onOpenDataElementSelector } />
          </label>
        </ValidationWrapper>
        <ValidationWrapper
          type="value"
          className="u-gapRight"
          error={ value.touched && value.error }
        >
          <label>
            <span className="u-label">has the value</span>
            <Textfield { ...value } />
          </label>
        </ValidationWrapper>
        <RegexToggle
          value={ value.value }
          valueIsRegex={ valueIsRegex.value }
          onValueChange={ value.onChange }
          onValueIsRegexChange={ valueIsRegex.onChange }
        />
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
  settingsToFormValues(values, options) {
    return {
      ...values,
      ...options.settings
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  },
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
