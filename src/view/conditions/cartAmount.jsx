import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';

class CartAmount extends React.Component {
  onOpenDataElementSelector = () => {
    window.extensionBridge.openDataElementSelector(this.props.fields.dataElement.onChange);
  };

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
              <Coral.Textfield ref="dataElementField" {...dataElement}/>
            </label>
            <DataElementSelectorButton ref="dataElementButton"
              onClick={this.onOpenDataElementSelector}/>
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
              <Coral.Textfield className="u-smallTextfield" ref="amountField" {...amount}/>
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
