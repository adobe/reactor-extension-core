import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

import ElementSelectorField, { formConfig as elementSelectorFieldFormConfig } from './elementSelectorField';
import ElementPropertiesEditor, { formConfig as elementPropertiesEditorFormConfig } from './elementPropertiesEditor';
import mergeFormConfigs from '../../utils/mergeFormConfigs';

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

export const formConfig = mergeFormConfigs(
  elementSelectorFieldFormConfig,
  elementPropertiesEditorFormConfig,
  {
    fields: [
      'showElementPropertiesFilter'
    ],
    settingsToFormValues: (values, settings) => {
      const { elementProperties } = settings;

      return {
        ...values,
        showElementPropertiesFilter: Boolean(elementProperties)
      };
    },
    formValuesToSettings: (settings, values) => {
      settings = {
        ...settings
      };

      if (!values.showElementPropertiesFilter) {
        delete settings.elementProperties;
      }

      delete settings.showElementPropertiesFilter;

      return settings;
    },
    validate: (errors, values) => {
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
  }
);
