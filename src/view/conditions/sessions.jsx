import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper } from '@reactor/react-components';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';

const Sessions = ({ ...props }) => {
  const { operator, count } = props.fields;

  return (
    <div>
      <div>
        <label className="u-gapRight">
          <span className="u-label">The user's number of sessions is</span>
          <ComparisonOperatorField { ...operator } />
        </label>
        <ValidationWrapper error={ count.touched && count.error }>
          <label>
            <span className="u-label">the value</span>
            <Textfield className="u-smallTextfield" { ...count } />
          </label>
        </ValidationWrapper>
      </div>
    </div>
  );
};

const formConfig = {
  fields: [
    'operator',
    'count'
  ],
  settingsToFormValues(values, options) {
    return {
      ...values,
      operator: options.settings.operator || '>'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
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
