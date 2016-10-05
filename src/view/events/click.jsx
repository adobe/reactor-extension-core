import React from 'react';

import Checkbox from '@coralui/react-coral/lib/Checkbox';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import extensionViewReduxForm from '../extensionViewReduxForm';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import CoralField from '../components/coralField';

const Click = () => (
  <div>
    <ElementFilter />
    <CoralField
      name="delayLinkActivation"
      className="u-block"
      component={ Checkbox }
    >
      If the element is a link, delay navigation until rule runs
    </CoralField>
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
