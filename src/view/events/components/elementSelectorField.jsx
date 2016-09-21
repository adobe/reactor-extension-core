import React from 'react';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';

export default ({ ...props }) => {
  const { elementSelector } = props.fields;

  return (
    <ValidationWrapper error={ elementSelector.touched && elementSelector.error }>
      <label>
        <span className="u-label">Elements matching the CSS selector</span>
        <Textfield { ...elementSelector } />
      </label>
    </ValidationWrapper>
  );
};

export const formConfig = {
  fields: [
    'elementSelector'
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
      elementSelector: values.elementSelector
    };
  }
};
