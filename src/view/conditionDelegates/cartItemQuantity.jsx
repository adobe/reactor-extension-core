import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';
import DataElementNameField from './components/dataElementNameField';
import ComparisonOperatorField from './components/comparisonOperatorField';

class CartItemQuantity extends React.Component {
  render() {
    const { dataElement, operator, quantity } = this.props.fields;

    return (
      <div>
        <div>
          <ValidationWrapper
            ref="dataElementWrapper"
            error={dataElement.touched && dataElement.error}>
            <label>
              <span className="u-label">The cart item quantity identified by the data element</span>
              <DataElementNameField ref="dataElementField" {...dataElement}/>
            </label>
          </ValidationWrapper>
        </div>
        <div className="u-gapTop">
          <label className="u-gapRight">
            <span className="u-label">is</span>
            <ComparisonOperatorField ref="operatorField" {...operator}/>
          </label>
          <ValidationWrapper ref="quantityWrapper" error={quantity.touched && quantity.error}>
            <label>
              <span className="u-label">the value</span>
              <Coral.Textfield ref="quantityField" {...quantity}/>
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
  configToFormValues(values, options) {
    return {
      ...values,
      operator: options.config.operator || '>'
    };
  },
  formValuesToConfig(config, values) {
    return {
      ...config,
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

    if (!values.quantity || isNaN(values.quantity)) {
      errors.quantity = 'Please specify a number for the cart item quantity.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(CartItemQuantity);
