/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
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
import Radio from '@react/react-spectrum/Radio';
import RadioGroup from '@react/react-spectrum/RadioGroup';
import Textfield from '@react/react-spectrum/Textfield';
import WrappedField from '../../components/wrappedField';

import { isNumberLikeInRange } from '../../utils/validators';

export default () => (
  <div>
    <label>
      <span className="u-verticalAlignMiddle u-gapRight">Trigger</span>
      <WrappedField
        name="delayType"
        component={RadioGroup}
      >
        <Radio value="immediate" label="immediately" />
        <Radio value="delay" label="after" />
      </WrappedField>
    </label>
    <WrappedField
      name="delay"
      component={Textfield}
    />
    <span className="u-verticalAlignMiddle u-gapRight u-gapLeft">milliseconds</span>
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

    if (values.delayType === 'delay' && !isNumberLikeInRange(values.delay, { min: 1 })) {
      errors.delay = 'Please specify a number greater than or equal to 1.';
    }

    return errors;
  }
};
