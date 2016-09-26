import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../extensionViewReduxForm';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';
import Field from '../components/field';

const CartItemQuantity = () => (
  <div>
    <div>
      <label>
        <span className="u-label">The cart item quantity identified by the data element</span>
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
          name="quantity"
          component={ Textfield }
          className="u-smallTextfield"
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
      quantity: Number(values.quantity)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.dataElement) {
      errors.dataElement = 'Please specify a data element.';
    }

    if (!isNumber(values.quantity)) {
      errors.quantity = 'Please specify a number for the cart item quantity.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(CartItemQuantity);
