import React from 'react';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';
import Textfield from '@coralui/react-coral/lib/Textfield';

class CartItemQuantity extends React.Component {
  onOpenDataElementSelector = () => {
    window.extensionBridge.openDataElementSelector(this.props.fields.dataElement.onChange);
  };

  render() {
    const { dataElement, operator, quantity } = this.props.fields;

    return (
      <div>
        <div>
          <ValidationWrapper
            type="dataElement"
            error={ dataElement.touched && dataElement.error }
          >
            <label>
              <span className="u-label">The cart item quantity identified by the data element</span>
              <Textfield { ...dataElement } />
              <DataElementSelectorButton onClick={ this.onOpenDataElementSelector } />
            </label>
          </ValidationWrapper>
        </div>
        <div className="u-gapTop">
          <label className="u-gapRight">
            <span className="u-label">is</span>
            <ComparisonOperatorField { ...operator } />
          </label>
          <ValidationWrapper type="quantity" error={ quantity.touched && quantity.error }>
            <label>
              <span className="u-label">the value</span>
              <Textfield className="u-smallTextfield" { ...quantity } />
            </label>
          </ValidationWrapper>
        </div>
      </div>
    );
  }
}

const formConfig = {
  fields: [
    'dataElement',
    'operator',
    'quantity'
  ],
  settingsToFormValues(values, options) {
    return {
      ...values,
      operator: options.settings.operator || '>'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
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
