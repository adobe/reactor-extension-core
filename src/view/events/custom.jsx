import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import extensionViewReduxForm from '../extensionViewReduxForm';
import mergeFormConfigs from '../utils/mergeFormConfigs';

function Custom({ ...props }) {
  const type = props.fields.type;

  return (
    <div>
      <ValidationWrapper error={ type.touched && type.error }>
        <label>
          <span className="u-label">Custom Event Type</span>
          <Textfield { ...type } />
        </label>
      </ValidationWrapper>
      <ElementFilter fields={ props.fields } />
      <AdvancedEventOptions fields={ props.fields } />
    </div>
  );
}

const formConfig = mergeFormConfigs(
  elementFilterFormConfig,
  advancedEventOptionsFormConfig,
  {
    fields: [
      'type'
    ],
    settingsToFormValues: (values, options) => ({
      ...values,
      type: options.settings.type
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
