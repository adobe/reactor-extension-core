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
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';

import extensionViewReduxForm from '../extensionViewReduxForm';

const DataElementChanged = () => (
  <label>
    <span className="u-label">Data Element Name</span>
    <Field
      name="name"
      component={ DecoratedInput }
      inputComponent={ Textfield }
      supportDataElementName
    />
  </label>
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
    if (!values.name) {
      errors = {
        ...errors,
        name: 'Please specify a data element name.'
      };
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(DataElementChanged);
