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
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Select from '@coralui/redux-form-react-coral/lib/Select';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import extensionViewReduxForm from '../extensionViewReduxForm';
import { isNumber } from '../utils/validators';
import comparisonOperatorOptions from './comparisonOperatorOptions';

const CartAmount = () => (
  <div>
    <div>
      <label>
        <span className="u-label">The cart amount identified by the data element</span>
        <Field
          name="dataElement"
          component={ DecoratedInput }
          inputComponent={ Textfield }
          supportDataElementName
        />
      </label>
    </div>
    <div className="u-gapTop">
      <label className="u-gapRight">
        <span className="u-label">is</span>
        <Field
          name="operator"
          component={ Select }
          options={ comparisonOperatorOptions }
        />
      </label>
      <label>
        <span className="u-label">the value</span>
        <Field
          name="amount"
          component={ DecoratedInput }
          inputComponent={ Textfield }
          inputClassName="u-smallTextfield"
        />
      </label>
    </div>
  </div>
);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings,
      operator: settings.operator || '>'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values,
      amount: Number(values.amount)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if ((values.dataElement && values.dataElement.indexOf('%') !== -1) || !values.dataElement) {
      errors.dataElement = 'Please specify a data element name (without % characters)';
    }

    if (!isNumber(values.amount)) {
      errors.amount = 'Please specify a number for the cart amount';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(CartAmount);
