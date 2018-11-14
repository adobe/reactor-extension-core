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
import InfoTip from '../components/infoTip';
import WrappedField from '../components/wrappedField';
import EditorButton from '../components/editorButton';

const CustomCode = () => (
  <div>
    <WrappedField
      name="source"
      component={EditorButton}
    />
    <InfoTip placement="bottom">
      Enter a script that evaluates to true or false to control whether this rule executes. Use
      this code to check for certain values (like shopping cart size or item price), whether a
      user is logged in or registered, or anything else you require.
    </InfoTip>
  </div>
);

export default CustomCode;

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.source) {
      errors.source = 'Please provide custom script.';
    }

    return errors;
  }
};
