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
import Checkbox from '@react/react-spectrum/Checkbox';
import WrappedField from '../components/wrappedField';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import mergeFormConfigs from '../utils/mergeFormConfigs';

const Click = () => (
  <div>
    <ElementFilter />
    <WrappedField
      name="delayLinkActivation"
      className="u-block"
      component={ Checkbox }
      label="If the element is a link, delay navigation until rule runs"
    />
    <AdvancedEventOptions />
  </div>
);

export default Click;

export const formConfig = mergeFormConfigs(
  elementFilterFormConfig,
  advancedEventOptionsFormConfig,
  {
    settingsToFormValues: (values, settings) => ({
      ...values,
      delayLinkActivation: settings.delayLinkActivation
    }),
    formValuesToSettings: (settings, values) => ({
      ...settings,
      delayLinkActivation: values.delayLinkActivation
    })
  }
);
