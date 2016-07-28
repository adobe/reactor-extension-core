import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';
import Textfield from '@coralui/react-coral/lib/Textfield';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper } from '@reactor/react-components';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';

const PageViews = ({ ...props }) => {
  const { operator, count, duration } = props.fields;

  return (
    <div>
      <div>
        <label className="u-gapRight">
          <span className="u-label">The user's number of page views is</span>
          <ComparisonOperatorField { ...operator } />
        </label>
        <ValidationWrapper error={ count.touched && count.error }>
          <label className="u-gapRight">
            <span className="u-label">the value</span>
            <Textfield className="u-smallTextfield" { ...count } />
          </label>
        </ValidationWrapper>
        <span className="u-noWrap">
          <label>
            <span className="u-label">over</span>
          </label>
          <Radio
            { ...duration }
            value="lifetime"
            checked={ duration.value === 'lifetime' }
          >
            Lifetime
          </Radio>
          <Radio
            { ...duration }
            value="session"
            checked={ duration.value === 'session' }
          >
            Current Session
          </Radio>
        </span>
      </div>
    </div>
  );
};

const formConfig = {
  fields: [
    'operator',
    'count',
    'duration'
  ],
  settingsToFormValues(values, options) {
    return {
      ...values,
      operator: options.settings.operator || '>',
      duration: options.settings.duration || 'lifetime'
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
      errors.count = 'Please specify a number of page views.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(PageViews);
