import React from 'react';
import reduceReducers from 'reduce-reducers';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

import ElementSelectorField, { formConfig as elementSelectorFieldFormConfig } from './elementSelectorField';
import ElementPropertiesEditor, { formConfig as elementPropertiesEditorFormConfig } from './elementPropertiesEditor';

export default ({ ...props }) => {
  const {
    showElementPropertiesFilter
  } = props.fields;

  return (
    <div>
      <ElementSelectorField fields={ props.fields } />
      <div>
        <Checkbox
          { ...showElementPropertiesFilter }
        >
          and having certain property values...
        </Checkbox>
        {
          showElementPropertiesFilter.value ?
            <ElementPropertiesEditor
              fields={ props.fields }
            /> : null
        }
      </div>
    </div>
  );
};

export const formConfig = {
  fields: [
    'showElementPropertiesFilter'
  ].concat(elementSelectorFieldFormConfig.fields, elementPropertiesEditorFormConfig.fields),
  settingsToFormValues: reduceReducers(
    elementPropertiesEditorFormConfig.settingsToFormValues,
    (values, options) => {
      const { elementProperties } = options.settings;

      return {
        ...values,
        showElementPropertiesFilter: Boolean(elementProperties)
      };
    }
  ),
  formValuesToSettings: reduceReducers(
    elementPropertiesEditorFormConfig.formValuesToSettings,
    (settings, values) => {
      settings = {
        ...settings
      };

      if (!values.showElementPropertiesFilter) {
        delete settings.elementProperties;
      }

      delete settings.showElementPropertiesFilter;

      return settings;
    }
  ),
  validate: reduceReducers(
    elementPropertiesEditorFormConfig.validate,
    (errors, values) => {
      errors = {
        ...errors
      };

      if (!values.elementSelector) {
        errors.elementSelector = 'Please specify a CSS selector.';
      }

      if (!values.showElementPropertiesFilter) {
        delete errors.elementProperties;
      }

      return errors;
    }
  )
};
