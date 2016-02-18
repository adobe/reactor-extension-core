import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';
import DataElementNameField from './components/dataElementNameField';
import ComparisonOperatorField from './components/comparisonOperatorField';

class CartAmount extends React.Component {
  render() {
    const { dataElement, operator, amount } = this.props.fields;

    return (
      <div>
        <div>
          <ValidationWrapper
            ref="dataElementWrapper"
            error={dataElement.touched && dataElement.error}>
            <label>
              <span className="u-label">The cart amount identified by the data element</span>
              <DataElementNameField ref="dataElementField" {...dataElement}/>
            </label>
          </ValidationWrapper>
        </div>
        <div className="u-gapTop">
          <label className="u-gapRight">
            <span className="u-label">is</span>
            <ComparisonOperatorField ref="operatorField" {...operator}/>
          </label>
          <ValidationWrapper ref="amountWrapper" error={amount.touched && amount.error}>
            <label>
              <span className="u-label">the value</span>
              <Coral.Textfield ref="amountField" {...amount}/>
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
    'amount'
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
      amount: Number(values.amount)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.dataElement) {
      errors.dataElement = 'Please specify a data element.';
    }

    if (!values.amount || isNaN(values.amount)) {
      errors.amount = 'Please specify a number for the cart amount';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(CartAmount);
