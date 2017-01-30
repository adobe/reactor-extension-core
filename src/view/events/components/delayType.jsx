/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

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
