import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import { formValueSelector, FieldArray } from 'redux-form';
import { connect } from 'react-redux';

import ElementSelector, { formConfig as elementSelectorFormConfig } from './elementSelector';
import ElementPropertiesEditor, { formConfig as elementPropertiesEditorFormConfig } from './elementPropertiesEditor';
import mergeFormConfigs from '../../utils/mergeFormConfigs';
import Field from '../../components/field';

const SpecificElements = ({ ...props }) => {
  const {
    showElementPropertiesFilter
  } = props;

  return (
    <div>
      <ElementSelector fields={ props.fields } />
      <div>
        <Field
          name="showElementPropertiesFilter"
          className="u-block"
          component={ Checkbox }
        >
          and having certain property values...
        </Field>
        {
          showElementPropertiesFilter ?
            <FieldArray
              component={ ElementPropertiesEditor }
              name="elementProperties"
            /> : null
        }
      </div>
    </div>
  );
};

const valueSelector = formValueSelector('default');
const stateToProps = state => ({
  showElementPropertiesFilter: valueSelector(state, 'showElementPropertiesFilter')
});

export default connect(stateToProps)(SpecificElements);

export const formConfig = mergeFormConfigs(
  elementSelectorFormConfig,
  elementPropertiesEditorFormConfig,
  {
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

      if (!values.showElementPropertiesFilter) {
        delete errors.elementProperties;
      }

      return errors;
    }
  }
);
