import React from 'react';
import Radio from '@coralui/redux-form-react-coral/lib/Radio';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import { isPositiveNumber } from '../../utils/validators';

export default () => (
  <div>
    <label>
      <span className="u-label u-gapRight">Trigger</span>
    </label>
    <Field
      name="delayType"
      component={ Radio }
      type="radio"
      value="immediate"
    >
      immediately
    </Field>
    <Field
      name="delayType"
      component={ Radio }
      type="radio"
      value="delay"
    >
      after
    </Field>
    <Field
      name="delay"
      component={ DecoratedInput }
      inputComponent={ Textfield }
    />
    <label>
      <span className="u-label u-gapLeft">milliseconds</span>
    </label>
  </div>
);

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      delayType: settings.delay > 0 ? 'delay' : 'immediate',
      delay: settings.delay > 0 ? settings.delay : ''
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    if (values.delayType === 'delay') {
      settings.delay = Number(values.delay);
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.delayType === 'delay' && !isPositiveNumber(values.delay)) {
      errors.delay = 'Please specify a positive number';
    }

    return errors;
  }
};
