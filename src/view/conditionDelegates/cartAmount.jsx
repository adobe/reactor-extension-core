import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';
import DataElementNameField from './components/dataElementNameField';
import ComparisonOperatorField from './components/comparisonOperatorField';

export let mapStateToProps = state => ({
  dataElementName: state.get('dataElementName'),
  operator: state.get('operator'),
  amount: state.get('amount'),
  dataElementNameIsEmpty: state.getIn(['errors', 'dataElementNameIsEmpty']),
  amountIsEmpty: state.getIn(['errors', 'amountIsEmpty']),
  amountIsNaN: state.getIn(['errors', 'amountIsNaN'])
});

export class CartAmount extends React.Component {
  render() {
    const { dataElementName, operator, amount } = this.props.fields;

    return (
      <div>
        <div>
          <ValidationWrapper error={dataElementName.touched && dataElementName.error}>
            <label>
              <span className="u-label">The cart amount identified by the data element</span>
              <DataElementNameField {...dataElementName}/>
            </label>
          </ValidationWrapper>
        </div>
        <div className="u-gapTop">
          <label className="u-gapRight">
            <span className="u-label">is</span>
            <ComparisonOperatorField {...operator}/>
          </label>
          <ValidationWrapper error={amount.touched && amount.error}>
            <label>
              <span className="u-label">the value</span>
              <Coral.Textfield {...amount}/>
            </label>
          </ValidationWrapper>
        </div>
      </div>
    );
  }
}

const fields = [
  'dataElementName',
  'operator',
  'amount'
];

const validate = values => {
  const errors = {};

  if (!values.dataElementName) {
    errors.dataElementName = 'Please specify a data element.';
  }

  if (!values.amount) {
    errors.amount = 'Please specify a cart amount';
  } else if (isNaN(values.amount)) {
    errors.amount = 'Please specify a number for the cart amount';
  }

  return errors;
};

export default extensionViewReduxForm({
  fields,
  validate
})(CartAmount);

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
      amount: Number(values.amount)
    };
  }
};
