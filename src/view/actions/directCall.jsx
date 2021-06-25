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
import EditorButton from '../components/editorButton';
import FullWidthField from '../components/fullWidthField';
import InfoTip from '../components/infoTip';
import WrappedField from '../components/wrappedField';

const DirectCall = () => (
  <>
    <FullWidthField
      label="Direct Call Identifier"
      name="identifier"
      containerMinWidth="size-6000"
      isRequired
    />

    <div className="u-gapTop">
      <p>
        (optional) The code that you provide in the editor will be run to
        provide an event detail to the Direct Call.
      </p>

      <WrappedField
        name="detail"
        component={EditorButton}
        language="javascript"
      />
      <InfoTip placement="bottom">
        Enter a script that returns a valid JavaScript key-value object.
      </InfoTip>
    </div>
  </>
);

export default DirectCall;

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

    if (!values.identifier) {
      errors.identifier = 'Please specify an identifier.';
    }

    // values.detail is optional, so skip its validation

    return errors;
  }
};
