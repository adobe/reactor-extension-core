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
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import { Field } from 'redux-form';

import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import extensionViewReduxForm from '../extensionViewReduxForm';
import mergeFormConfigs from '../utils/mergeFormConfigs';

const Click = () => (
  <div>
    <ElementFilter />
    <Field
      name="delayLinkActivation"
      className="u-block"
      component={ Checkbox }
    >
      If the element is a link, delay navigation until rule runs
    </Field>
    <AdvancedEventOptions />
  </div>
);

const formConfig = mergeFormConfigs(
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

export default extensionViewReduxForm(formConfig)(Click);
