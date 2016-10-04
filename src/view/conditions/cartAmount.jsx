import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../extensionViewReduxForm';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';
import Field from '../components/field';

const CartAmount = () => (
  <div>
    <div>
      <label>
        <span className="u-label">The cart amount identified by the data element</span>
        <Field
          name="dataElement"
          component={ Textfield }
          supportValidation
          supportDataElementName
        />
      </label>
    </div>
    <div className="u-gapTop">
      <label className="u-gapRight">
        <span className="u-label">is</span>
        <Field name="operator" component={ ComparisonOperatorField } />
      </label>
      <label>
        <span className="u-label">the value</span>
        <Field
          name="amount"
          component={ Textfield }
          componentClassName="u-smallTextfield"
          supportValidation
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
