import React from 'react';

import Textfield from '@coralui/react-coral/lib/Textfield';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper } from '@reactor/react-components';
import { isPositiveNumber } from '../utils/validators';

const TimeSpentOnPage = ({ ...props }) => {
  const { timeOnPage } = props.fields;
  return (
    <div>
      <label>
        <span className="u-label u-gapRight">Trigger after</span>
      </label>
      <ValidationWrapper
        error={ timeOnPage.touched && timeOnPage.error }
      >
        <Textfield
          { ...timeOnPage }
        />
      </ValidationWrapper>
      <label>
        <span className="u-label u-gapLeft">seconds spent on the page</span>
      </label>
    </div>
  );
};

const formConfig = {
  fields: ['timeOnPage'],
  formValuesToSettings: (settings, values) => ({
    ...settings,
    timeOnPage: Number(values.timeOnPage)
  }),
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    if (!isPositiveNumber(values.timeOnPage)) {
      errors.timeOnPage = 'Please specify a positive number';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(TimeSpentOnPage);
