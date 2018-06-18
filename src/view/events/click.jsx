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
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import Checkbox from '@react/react-spectrum/Checkbox';
import Textfield from '@react/react-spectrum/Textfield/index';
import WrappedField from '../components/wrappedField';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import { isNumberLikeInRange } from '../utils/validators';

const Click = props => (
  <div>
    <ElementFilter />
    <WrappedField
      name="delayLinkActivation"
      className="u-block"
      component={ Checkbox }
      label="If the element is a link, delay navigation until rule runs"
    />

    {props.delayLinkActivation ? (
      <div className="FieldSubset">
        <span className="u-verticalAlignMiddle u-gapRight">Link delay</span>
        <WrappedField
          name="anchorDelay"
          component={ Textfield }
        />
      </div>
    ) : null}

    <AdvancedEventOptions />
  </div>
);

export default connect(state => ({
  delayLinkActivation: formValueSelector('default')(
    state,
    'delayLinkActivation'
  )
}))(Click);

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
        anchorDelay: Number(values.anchorDelay)
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

      if (values.delayLinkActivation && !isNumberLikeInRange(values.anchorDelay, { min: 1 })) {
        errors.anchorDelay = 'Please specify a number greater than or equal to 1.';
      }

      return errors;
    }
  }
);
