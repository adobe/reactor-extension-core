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
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { Checkbox, TextField, View } from '@adobe/react-spectrum';
import WrappedField from '../components/wrappedField';
import ElementFilter, {
  formConfig as elementFilterFormConfig
} from './components/elementFilter';
import AdvancedEventOptions, {
  formConfig as advancedEventOptionsFormConfig
} from './components/advancedEventOptions';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import { isDataElementToken, isNumberLikeInRange } from '../utils/validators';
import HelpText from '../components/helpText';

const Click = ({ delayLinkActivation }) => (
  <>
    <ElementFilter elementSpecificityLabel="When the user clicks on" />
    <WrappedField name="delayLinkActivation" component={Checkbox}>
      If the element is a link, delay navigation
    </WrappedField>

    {delayLinkActivation ? (
      <View marginBottom="size-100">
        <HelpText marginBottom="size-200">
          Link Delay is provided for backward compatibility with DTM
          implementations, but is no longer supported or recommended for use.
        </HelpText>
        <WrappedField
          name="anchorDelay"
          label="Link delay"
          isRequired
          component={TextField}
          supportDataElement
        />
      </View>
    ) : null}

    <AdvancedEventOptions />
  </>
);

export default connect((state) => ({
  delayLinkActivation: formValueSelector('default')(
    state,
    'delayLinkActivation'
  )
}))(Click);

const minNumberOptions = { min: 1 };

export const formConfig = mergeFormConfigs(
  elementFilterFormConfig,
  advancedEventOptionsFormConfig,
  {
    settingsToFormValues: (values, settings) => {
      const formValues = {
        ...values,
        anchorDelay: settings.anchorDelay
      };

      if (formValues.anchorDelay) {
        formValues.delayLinkActivation = true;
      } else {
        formValues.delayLinkActivation = false;
        formValues.anchorDelay = 100;
      }

      return formValues;
    },
    formValuesToSettings: (settings, values) => {
      const newSettings = {
        ...settings,
        anchorDelay: isNumberLikeInRange(values.anchorDelay, minNumberOptions)
          ? Number(values.anchorDelay)
          : String(values.anchorDelay)
      };

      if (!values.delayLinkActivation) {
        delete newSettings.anchorDelay;
      }

      return newSettings;
    },
    validate(errors, values) {
      errors = {
        ...errors
      };

      if (
        values.delayLinkActivation &&
        !isNumberLikeInRange(values.anchorDelay, minNumberOptions) &&
        !isDataElementToken(values.anchorDelay)
      ) {
        errors.anchorDelay =
          'Please specify a number greater than or equal to 1, or specify a data element.';
      }

      return errors;
    }
  }
);
