import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';

import extensionViewReduxForm from '../extensionViewReduxForm';

class LoggedIn extends React.Component {
  onOpenDataElementSelector = () => {
    window.extensionBridge.openDataElementSelector(this.props.fields.dataElement.onChange);
  };

  render() {
    const { dataElement } = this.props.fields;

    return (
      <ValidationWrapper
        className="u-gapRight"
        error={ dataElement.touched && dataElement.error }
      >
        <label>
          <span className="u-label">
            Data element identifying whether the user is logged in
          </span>
          <Textfield { ...dataElement } />
          <DataElementSelectorButton onClick={ this.onOpenDataElementSelector } />
        </label>
      </ValidationWrapper>
    );
  }
}

const formConfig = {
  fields: [
    'dataElement'
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

    if (!values.dataElement) {
      errors.dataElement = 'Please specify a data element.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(LoggedIn);
