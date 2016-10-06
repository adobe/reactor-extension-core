import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Select from '@coralui/react-coral/lib/Select';

import CoralField from '../components/coralField';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { isPositiveNumber } from '../utils/validators';
import mergeFormConfigs from '../utils/mergeFormConfigs';

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

const TimePlayed = () => (
  <div>
    <ElementFilter />
    <div className="u-gapTop">
      <label>
        <span className="u-label u-gapRight">Trigger when</span>
      </label>
      <CoralField
        name="amount"
        component={ Textfield }
        supportValidation
      />
      <CoralField
        className="u-gapLeft"
        componentClassName="TimePlayed-unitSelect"
        name="unit"
        component={ Select }
        options={ timePlayedUnitOptions }
      />
      <label>
        <span className="u-label u-gapLeft">have passed</span>
      </label>
    </div>
    <AdvancedEventOptions />
  </div>
);

const formConfig = mergeFormConfigs(
  elementFilterFormConfig,
  advancedEventOptionsFormConfig,
  {
    settingsToFormValues: (values, settings) => ({
      ...values,
      unit: settings.unit || timePlayedUnit.SECOND
    }),
    formValuesToSettings: (settings, values) => ({
      ...settings,
      unit: values.unit,
      amount: Number(values.amount)
    }),
    validate: (errors, values) => {
      errors = {
        ...errors
      };

      if (!isPositiveNumber(values.amount)) {
        errors.amount = 'Please specify a positive number';
      }

      return errors;
    }
  }
);


export default extensionViewReduxForm(formConfig)(TimePlayed);
