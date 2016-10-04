import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';

import Field from '../components/field';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';

const TimeOnSite = () => (
  <div>
    <div>
      <label className="u-gapRight">
        <span className="u-label">User has spent</span>
        <Field name="operator" component={ ComparisonOperatorField } />
      </label>
      <label>
        <Field
          componentClassName="u-smallTextfield"
          name="minutes"
          component={ Textfield }
          supportValidation
        />
        <span className="u-label u-gapLeft">minutes on site</span>
      </label>
    </div>
  </div>
);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings,
      operator: settings.operator || '>'
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
