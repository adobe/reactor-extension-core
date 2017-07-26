/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import React from 'react';
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import { Field, formValueSelector, FieldArray } from 'redux-form';
import Alert from '@coralui/react-coral/lib/Alert';
import { connect } from 'react-redux';

import ElementSelector, { formConfig as elementSelectorFormConfig } from './elementSelector';
import ElementPropertiesEditor, { formConfig as elementPropertiesEditorFormConfig } from './elementPropertiesEditor';
import mergeFormConfigs from '../../utils/mergeFormConfigs';

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
            <div>
              <Alert variant="warning">
                Using this option to target elements will add logic to the JavaScript
                library that may adversely affect performance. Adobe recommends using the CSS
                selector option above whenever possible.
              </Alert>
              <FieldArray
                component={ ElementPropertiesEditor }
                name="elementProperties"
              />
            </div> : null
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
