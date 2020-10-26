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
import Textfield from '@react/react-spectrum/Textfield';
import WrappedField from '../components/wrappedField';
import InfoTip from '../components/infoTip';
import { isDataElementToken } from '../utils/validators';
import TooltipPlaceholder from '../components/tooltipPlaceholder';

export default () => (
  <div>
    <label className="u-gapRight u-alignItemsCenter u-flex">
      <span className="u-gapRight u-noWrap">CSP Nonce</span>
      <WrappedField
        className="u-flexOne u-alignItemsCenter u-flex"
        name="cspNonce"
        component={Textfield}
        componentClassName="u-fullWidth u-minFieldWidth"
        supportDataElement
      />

      <InfoTip placement="bottom">
        If you are implementing a Content Security Policy on your site and using
        a nonce that you generate to authenticate inline scripts, please provide
        the data element that references your nonce.
      </InfoTip>
      <TooltipPlaceholder />
    </label>
  </div>
);

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings
    };
  },
  formValuesToSettings(settings, values) {
    if (!values.cspNonce) {
      delete values.cspNonce;
    }

    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.cspNonce && !isDataElementToken(values.cspNonce)) {
      errors.cspNonce =
        'Please specify a data element that will return the CSP Nonce value.';
    }

    return errors;
  }
};
