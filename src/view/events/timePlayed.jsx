import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ReduxFormSelect as Select, ValidationWrapper } from '@reactor/react-components';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import extensionViewReduxForm from '../extensionViewReduxForm';
import reduceReducers from 'reduce-reducers';
import { isPositiveNumber } from '../utils/validators';

const timePlayedUnit = {
  SECOND: 'second',
  PERCENT: 'percent'
};

const timePlayedUnitOptions = [
  {
    value: timePlayedUnit.SECOND,
    label: 'seconds'
  },
  {
    value: timePlayedUnit.PERCENT,
    label: '%'
  }
];

const TimePlayed = ({ ...props }) => {
  const { amount, unit } = props.fields;
  return (
    <div>
      <ElementFilter fields={ props.fields } />
      <div className="u-gapTop">
        <label>
          <span className="u-label u-gapRight">Trigger when</span>
        </label>
        <ValidationWrapper
          error={ amount.touched && amount.error }
        >
          <Textfield
            { ...amount }
          />
        </ValidationWrapper>
        <Select
          { ...unit }
          className="u-gapLeft TimePlayed-unitSelect"
          options={ timePlayedUnitOptions }
        />
        <label>
          <span className="u-label u-gapLeft">have passed</span>
        </label>
      </div>
      <AdvancedEventOptions fields={ props.fields } />
    </div>
  );
};

const formConfig = {
  fields: [
    'amount',
    'unit'
  ].concat(elementFilterFormConfig.fields, advancedEventOptionsFormConfig.fields),
  settingsToFormValues: reduceReducers(
    elementFilterFormConfig.settingsToFormValues,
    advancedEventOptionsFormConfig.settingsToFormValues,
    (values, options) => ({
      ...values,
      unit: options.settings.unit || timePlayedUnit.SECOND
    })
  ),
  formValuesToSettings: reduceReducers(
    elementFilterFormConfig.formValuesToSettings,
    (settings, values) => ({
      ...settings,
      amount: Number(values.amount)
    })
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
