import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';

import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import extensionViewReduxForm from '../extensionViewReduxForm';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import CoralField from '../components/coralField';

const Custom = () => (
  <div>
    <label>
      <span className="u-label">Custom Event Type</span>
      <CoralField
        name="type"
        component={ Textfield }
        supportValidation
      />
    </label>
    <ElementFilter />
    <AdvancedEventOptions />
  </div>
);

const formConfig = mergeFormConfigs(
  elementFilterFormConfig,
  advancedEventOptionsFormConfig,
  {
    settingsToFormValues: (values, settings) => ({
      ...values,
      type: settings.type
    }),
    formValuesToSettings: (settings, values) => ({
      ...settings,
      type: values.type
    }),
    validate: (errors, values) => {
      errors = {
        ...errors
      };

      if (!values.type) {
        errors.type = 'Please specify a custom event type.';
      }

      return errors;
    }
  }
);

export default extensionViewReduxForm(formConfig)(Custom);
