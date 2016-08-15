import React from 'react';
import reduceReducers from 'reduce-reducers';

import ElementFilter, { formConfig as elementFilterFormConfig } from './elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './advancedEventOptions';
import extensionViewReduxForm from '../../extensionViewReduxForm';

const StandardEvent = ({ ...props }) => (
  <div>
    <ElementFilter fields={ props.fields } />
    <AdvancedEventOptions fields={ props.fields } />
  </div>
);

const formConfig = {
  fields: elementFilterFormConfig.fields.concat(advancedEventOptionsFormConfig.fields),
  settingsToFormValues: reduceReducers(
    elementFilterFormConfig.settingsToFormValues,
    advancedEventOptionsFormConfig.settingsToFormValues
  ),
  formValuesToSettings: elementFilterFormConfig.formValuesToSettings,
  validate: elementFilterFormConfig.validate
};

export default extensionViewReduxForm(formConfig)(StandardEvent);
