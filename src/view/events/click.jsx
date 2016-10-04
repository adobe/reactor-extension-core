import React from 'react';

import Checkbox from '@coralui/react-coral/lib/Checkbox';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import extensionViewReduxForm from '../extensionViewReduxForm';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import Field from '../components/field';

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
