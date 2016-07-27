import React from 'react';
import SpecificElements, { formConfig as specificElementsFormConfig } from './components/specificElements';
import DelayType, { formConfig as delayTypeFormConfig } from './components/delayType';
import extensionViewReduxForm from '../extensionViewReduxForm';
import reduceReducers from 'reduce-reducers';

const EntersViewport = ({ ...props }) => (
  <div>
    <SpecificElements fields={ props.fields } />
    <DelayType fields={ props.fields } />
  </div>
);

const formConfig = {
  fields: specificElementsFormConfig.fields.concat(delayTypeFormConfig.fields),
  validate: reduceReducers(
    specificElementsFormConfig.validate,
    delayTypeFormConfig.validate
  ),
  settingsToFormValues: reduceReducers(
    specificElementsFormConfig.settingsToFormValues,
    delayTypeFormConfig.settingsToFormValues
  ),
  formValuesToSettings: reduceReducers(
    specificElementsFormConfig.formValuesToSettings,
    delayTypeFormConfig.formValuesToSettings
  )
};

export default extensionViewReduxForm(formConfig)(EntersViewport);
