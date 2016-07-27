import React from 'react';

import extensionViewReduxForm from '../extensionViewReduxForm';
import reduceReducers from 'reduce-reducers';
import DelayType, { formConfig as delayTypeFormConfig } from './components/delayType';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import SpecificElements, { formConfig as specificElementsFormConfig } from './components/specificElements';

const Hover = ({ ...props }) => (
  <div>
    <SpecificElements fields={ props.fields } />
    <DelayType fields={ props.fields } />
    <AdvancedEventOptions fields={ props.fields } />
  </div>
);

const formConfig = {
  fields: delayTypeFormConfig.fields
    .concat(specificElementsFormConfig.fields, advancedEventOptionsFormConfig.fields),
  settingsToFormValues: reduceReducers(
    specificElementsFormConfig.settingsToFormValues,
    delayTypeFormConfig.settingsToFormValues,
    advancedEventOptionsFormConfig.settingsToFormValues
  ),
  formValuesToSettings: reduceReducers(
    specificElementsFormConfig.formValuesToSettings,
    delayTypeFormConfig.formValuesToSettings
  ),
  validate: reduceReducers(
    specificElementsFormConfig.validate,
    delayTypeFormConfig.validate
  )
};

export default extensionViewReduxForm(formConfig)(Hover);
