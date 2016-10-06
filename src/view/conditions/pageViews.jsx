import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../extensionViewReduxForm';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';
import CoralField from '../components/coralField';

const PageViews = () => (
  <div>
    <div>
      <label className="u-gapRight">
        <span className="u-label">The user's number of page views is</span>
        <CoralField name="operator" component={ ComparisonOperatorField } />
      </label>
      <label className="u-gapRight">
        <span className="u-label">the value</span>
        <CoralField
          name="count"
          component={ Textfield }
          componentClassName="u-smallTextfield"
          supportValidation
        />
      </label>
      <span className="u-noWrap">
        <label>
          <span className="u-label">over</span>
        </label>
        <CoralField
          name="duration"
          component={ Radio }
          value="lifetime"
        >
          Lifetime
        </CoralField>
        <CoralField
          name="duration"
          component={ Radio }
          value="session"
        >
          Current Session
        </CoralField>
      </span>
    </div>
  </div>
);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings,
      operator: settings.operator || '>',
      duration: settings.duration || 'lifetime'
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
      errors.count = 'Please specify a number of page views.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(PageViews);
