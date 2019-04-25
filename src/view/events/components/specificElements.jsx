/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
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
import Checkbox from '@react/react-spectrum/Checkbox';
import { formValueSelector } from 'redux-form';
import { Toast } from '@react/react-spectrum/Toast';
import { connect } from 'react-redux';
import WrappedField from '../../components/wrappedField';
import ElementSelector, { formConfig as elementSelectorFormConfig } from './elementSelector';
import ElementPropertiesEditor, { formConfig as elementPropertiesEditorFormConfig } from './elementPropertiesEditor';
import mergeFormConfigs from '../../utils/mergeFormConfigs';

const SpecificElements = ({ ...props }) => {
  const {
    showElementPropertiesFilter,
    fields
  } = props;

  return (
    <div>
      <ElementSelector fields={fields} />
      <div>
        <WrappedField
          name="showElementPropertiesFilter"
          className="u-block"
          component={Checkbox}
        >
          and having certain property values...
        </WrappedField>
        {
          showElementPropertiesFilter ?
            (
              <div>
                <Toast variant="warning" className="u-gapBottom">
                Using this option to target elements will add logic to the JavaScript
                library that will adversely affect performance. Adobe recommends using the CSS
                selector option above.
                </Toast>
                <ElementPropertiesEditor />
              </div>
            ) : null
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
