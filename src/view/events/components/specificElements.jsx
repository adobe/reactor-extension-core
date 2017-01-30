/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import React from 'react';
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import { Field, formValueSelector, FieldArray } from 'redux-form';
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
