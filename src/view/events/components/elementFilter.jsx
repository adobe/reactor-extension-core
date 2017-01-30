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
import Radio from '@coralui/redux-form-react-coral/lib/Radio';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import SpecificElements, { formConfig as specificElementsFormConfig } from './specificElements';
import mergeFormConfigs from '../../utils/mergeFormConfigs';

const ElementFilter = ({ ...props }) => {
  const { elementSpecificity } = props;

  return (
    <div>
      <div>
        <Field
          name="elementSpecificity"
          component={ Radio }
          type="radio"
          value="specific"
        >
          specific elements
        </Field>
        <Field
          name="elementSpecificity"
          component={ Radio }
          type="radio"
          value="any"
        >
          any element
        </Field>
      </div>
      {
        elementSpecificity === 'specific' ?
          <SpecificElements fields={ props.fields } /> : null
      }
    </div>
  );
};

const valueSelector = formValueSelector('default');
const stateToProps = state => ({
  elementSpecificity: valueSelector(state, 'elementSpecificity')
});

export default connect(stateToProps)(ElementFilter);

export const formConfig = mergeFormConfigs(
  specificElementsFormConfig,
  {
    settingsToFormValues: (values, settings, state) => {
      const { elementSelector, elementProperties } = settings;

      return {
        ...values,
        elementSpecificity: state.meta.isNew || elementSelector || elementProperties ?
          'specific' : 'any'
      };
    },
    formValuesToSettings: (settings, values) => {
      settings = {
        ...settings
      };

      const { elementSpecificity } = values;

      if (elementSpecificity === 'any') {
        delete settings.elementSelector;
        delete settings.elementProperties;
      }

      delete settings.elementSpecificity;

      return settings;
    },
    validate(errors, values) {
      errors = {
        ...errors
      };

      errors = specificElementsFormConfig.validate(errors, values);
      if (values.elementSpecificity !== 'specific') {
        delete errors.elementSelector;
      }

      return errors;
    }
  }
);
