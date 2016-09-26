import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Field from '../../components/field';

export default () => (
  <label>
    <span className="u-label">Elements matching the CSS selector</span>
    <Field
      name="elementSelector"
      component={ Textfield }
      supportValidation
      supportCssSelector
    />
  </label>
);

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      elementSelector: values.elementSelector
    };
  },
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    if (!values.elementSelector) {
      errors.elementSelector = 'Please specify a CSS selector.';
    }

    return errors;
  }
};
