import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';
import Textfield from '@coralui/react-coral/lib/Textfield';

import CoralField from '../../components/coralField';
import { isPositiveNumber } from '../../utils/validators';

export default () => (
  <div>
    <label>
      <span className="u-label u-gapRight">Trigger</span>
    </label>
    <CoralField
      name="delayType"
      component={ Radio }
      value="immediate"
    >
      immediately
    </CoralField>
    <CoralField
      name="delayType"
      component={ Radio }
      value="delay"
    >
      after
    </CoralField>
    <CoralField
      name="delay"
      component={ Textfield }
      supportValidation
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
