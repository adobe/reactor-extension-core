import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper } from '@reactor/react-components';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import extensionViewReduxForm from '../extensionViewReduxForm';
import reduceReducers from 'reduce-reducers';
import { isPositiveNumber } from '../utils/validators';

const timePlayedUnit = {
  SECOND: 'second',
  PERCENT: 'percent'
};

class TimePlayed extends React.Component {
  render() {
    const { amount, unit } = this.props.fields;
    return (
      <div>
        <ElementFilter ref="elementFilter" fields={this.props.fields}/>
        <div className="u-gapTop">
          <label>
            <span className="u-label u-gapRight">Trigger when</span>
          </label>
          <ValidationWrapper
            ref="delayValidationWrapper"
            error={amount.touched && amount.error}>
            <Coral.Textfield
              ref="amountField"
              {...amount}/>
          </ValidationWrapper>
          <Coral.Select
            {...unit}
            ref="unitSelect"
            className="u-gapLeft TimePlayed-unitSelect">
            <coral-select-item value={timePlayedUnit.SECOND}>
              seconds
            </coral-select-item>
            <coral-select-item value={timePlayedUnit.PERCENT}>
              %
            </coral-select-item>
          </Coral.Select>
          <label>
            <span className="u-label u-gapLeft">have passed</span>
          </label>
        </div>
        <AdvancedEventOptions ref="advancedEventOptions" fields={this.props.fields}/>
      </div>
    );
  }
}

const formConfig = {
  fields: [
    'amount',
    'unit'
  ].concat(elementFilterFormConfig.fields, advancedEventOptionsFormConfig.fields),
  settingsToFormValues: reduceReducers(
    elementFilterFormConfig.settingsToFormValues,
    advancedEventOptionsFormConfig.settingsToFormValues,
    (values, options) => {
      return {
        ...values,
        unit: options.settings.unit || timePlayedUnit.SECOND
      };
    }
  ),
  formValuesToSettings: reduceReducers(
    elementFilterFormConfig.formValuesToSettings,
    (settings, values) => {
      return {
        ...settings,
        amount: Number(values.amount)
      };
    }
  ),
  validate: reduceReducers(
    elementFilterFormConfig.validate,
    (errors, values) => {
      errors = {
        ...errors
      };

      if (!isPositiveNumber(values.amount)) {
        errors.amount = 'Please specify a positive number';
      }

      return errors;
    }
  )
};


export default extensionViewReduxForm(formConfig)(TimePlayed);
