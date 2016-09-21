import React from 'react';
import reduceReducers from 'reduce-reducers';

import Checkbox from '@coralui/react-coral/lib/Checkbox';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import extensionViewReduxForm from '../extensionViewReduxForm';

function Click({ ...props }) {
  const { delayLinkActivation } = props.fields;

  return (
    <div>
      <ElementFilter fields={ props.fields } />
      <Checkbox
        className="u-block"
        { ...delayLinkActivation }
      >
        If the element is a link, delay navigation until rule runs
      </Checkbox>
      <AdvancedEventOptions fields={ props.fields } />
    </div>
  );
}

const formConfig = {
  fields: [
    'delayLinkActivation'
  ].concat(elementFilterFormConfig.fields, advancedEventOptionsFormConfig.fields),
  settingsToFormValues: reduceReducers(
    elementFilterFormConfig.settingsToFormValues,
    advancedEventOptionsFormConfig.settingsToFormValues,
    (values, options) => ({
      ...values,
      delayLinkActivation: options.settings.delayLinkActivation
    })
  ),
  formValuesToSettings: reduceReducers(
    elementFilterFormConfig.formValuesToSettings,
    advancedEventOptionsFormConfig.formValuesToSettings,
    (settings, values) => ({
      ...settings,
      delayLinkActivation: values.delayLinkActivation
    })
  ),
  validate: elementFilterFormConfig.validate
};

export default extensionViewReduxForm(formConfig)(Click);
