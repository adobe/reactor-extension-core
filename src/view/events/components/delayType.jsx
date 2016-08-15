import React from 'react';
import { ValidationWrapper } from '@reactor/react-components';
import Radio from '@coralui/react-coral/lib/Radio';
import Textfield from '@coralui/react-coral/lib/Textfield';

import { isPositiveNumber } from '../../utils/validators';

export default class DelayType extends React.Component {
  render() {
    const { delayType, delay } = this.props.fields;

    return (
      <div>
        <label>
          <span className="u-label u-gapRight">Trigger</span>
        </label>
        <Radio
          { ...delayType }
          value="immediate"
          checked={ delayType.value === 'immediate' }
        >
          immediately
        </Radio>
        <Radio
          { ...delayType }
          value="delay"
          checked={ delayType.value === 'delay' }
          onClick={ this.onDelayTypeClick }
        >
          after
        </Radio>
        <ValidationWrapper
          error={ delay.touched && delay.error }
        >
          <Textfield
            { ...delay }
            onClick={ this.onDelayFieldClick }
          />
        </ValidationWrapper>
        <label>
          <span className="u-label u-gapLeft">milliseconds</span>
        </label>
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'delayType',
    'delay'
  ],
  settingsToFormValues(values, options) {
    return {
      ...values,
      delayType: options.settings.delay > 0 ? 'delay' : 'immediate',
      delay: options.settings.delay > 0 ? options.settings.delay : ''
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    if (values.delayType === 'delay') {
      settings.delay = Number(values.delay);
    } else {
      delete settings.delay;
    }

    delete settings.delayType;
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
