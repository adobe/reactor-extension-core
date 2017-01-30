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
import Icon from '@coralui/react-coral/lib/Icon';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Tooltip from '@coralui/react-coral/lib/Tooltip';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';


const Variable = () => (
  <div>
    <label className="u-gapRight">
      <span className="u-label">JS Variable Name</span>
      <Field
        name="name"
        component={ DecoratedInput }
        inputComponent={ Textfield }
      />
    </label>
    <label className="u-gapRight">
      <span className="u-label">JS Variable Value</span>
      <Field
        name="value"
        component={ DecoratedInput }
        inputComponent={ Textfield }
      />
    </label>
    <Tooltip
      className="u-tooltipMaxWidth"
      openOn="hover"
      content="Specify a text (string) value here. The rule will only fire if the specified
      variable contains this string. Note: If your variable contains a number, this will not
      work as expected."
    >
      <Icon icon="infoCircle" size="XS" className="u-inline-tooltip u-gapRight" />
    </Tooltip>
    <Field
      name="valueIsRegex"
      component={ RegexToggle }
      valueFieldName="value"
    />
  </div>
);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.name) {
      errors.name = 'Please specify a variable name.';
    }

    if (!values.value) {
      errors.value = 'Please specify a variable value.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Variable);
