import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';
import DataElementNameField from './components/dataElementNameField';
import ComparisonOperatorField from './components/comparisonOperatorField';

export class CartItemQuantity extends React.Component {
  render() {
    const { dataElement, operator, quantity } = this.props.fields;

    return (
      <div>
        <div>
          <ValidationWrapper error={dataElement.touched && dataElement.error}>
            <label>
              <span className="u-label">The cart item quantity identified by the data element</span>
              <DataElementNameField {...dataElement}/>
            </label>
          </ValidationWrapper>
        </div>
        <div className="u-gapTop">
          <label className="u-gapRight">
            <span className="u-label">is</span>
            <ComparisonOperatorField {...operator}/>
          </label>
          <ValidationWrapper error={quantity.touched && quantity.error}>
            <label>
              <span className="u-label">the value</span>
              <Coral.Textfield {...quantity}/>
            </label>
          </ValidationWrapper>
        </div>
      </div>
    );
  }
}

const fields = [
  'dataElement',
  'operator',
  'quantity'
];

const validate = values => {
  const errors = {};

  if (!values.dataElement) {
    errors.dataElement = 'Please specify a data element.';
  }

  if (!values.quantity || isNaN(values.quantity)) {
    errors.quantity = 'Please specify a number for the cart item quantity.';
  }

  return errors;
};

export default extensionViewReduxForm({
  fields,
  validate
})(CartItemQuantity);

export const reducers = {
  configToFormValues(values, options) {
    values = {
      ...values
    };

    if (!options.config.operator) {
      values.operator = '>'
    }

    return values;
  },
  formValuesToConfig(config, values) {
    return {
      ...config,
      quantity: Number(values.quantity)
    };
  }
};
