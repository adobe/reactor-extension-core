import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import extensionViewReduxForm from '../extensionViewReduxForm';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';

function TimeOnSite({ ...props }) {
  const { operator, minutes } = props.fields;

  return (
    <div>
      <div>
        <label className="u-gapRight">
          <span className="u-label">User has spent</span>
          <ComparisonOperatorField { ...operator } />
        </label>
        <ValidationWrapper error={ minutes.touched && minutes.error }>
          <label>
            <Textfield className="u-smallTextfield" { ...minutes } />
            <span className="u-label u-gapLeft">minutes on site</span>
          </label>
        </ValidationWrapper>
      </div>
    </div>
  );
}

const formConfig = {
  fields: [
    'operator',
    'minutes'
  ],
  settingsToFormValues(values, options) {
    return {
      ...values,
      ...options.settings,
      operator: options.settings.operator || '>'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values,
      minutes: Number(values.minutes)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!isNumber(values.minutes)) {
      errors.minutes = 'Please specify a positive number of minutes.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(TimeOnSite);
