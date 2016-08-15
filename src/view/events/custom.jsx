import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import reduceReducers from 'reduce-reducers';
import { ValidationWrapper } from '@reactor/react-components';

import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import extensionViewReduxForm from '../extensionViewReduxForm';

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

const formConfig = {
  fields: [
    'type'
  ].concat(elementFilterFormConfig.fields, advancedEventOptionsFormConfig.fields),
  settingsToFormValues: reduceReducers(
    elementFilterFormConfig.settingsToFormValues,
    advancedEventOptionsFormConfig.settingsToFormValues
  ),
  formValuesToSettings: elementFilterFormConfig.formValuesToSettings,
  validate: reduceReducers(
    (errors, values) => {
      errors = {
        ...errors
      };

      if (!values.type) {
        errors.type = 'Please specify a custom event type.';
      }

      return errors;
    },
    elementFilterFormConfig.validate
  )
};

export default extensionViewReduxForm(formConfig)(Custom);
