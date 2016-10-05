import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../extensionViewReduxForm';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';
import CoralField from '../components/coralField';

const Sessions = () => (
  <div>
    <div>
      <label className="u-gapRight">
        <span className="u-label">The user's number of sessions is</span>
        <CoralField name="operator" component={ ComparisonOperatorField } />
      </label>
      <label>
        <span className="u-label">the value</span>
        <CoralField
          componentClassName="u-smallTextfield"
          name="count"
          component={ Textfield }
          supportValidation
        />
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
      count: Number(values.count)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!isNumber(values.count)) {
      errors.count = 'Please specify a number of sessions.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Sessions);
