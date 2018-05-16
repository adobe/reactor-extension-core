/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import React from 'react';
import Radio from '@coralui/redux-form-react-coral/lib/Radio';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import { isPositiveNumberLike } from '../../utils/validators';

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

    if (values.delayType === 'delay' && !isPositiveNumberLike(values.delay)) {
      errors.delay = 'Please specify a positive number';
    }

    return errors;
  }
};
