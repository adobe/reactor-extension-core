import React from 'react';
import Coral from '../reduxFormCoralUI';
import ValidationWrapper from '../components/validationWrapper';
import ElementFilter, {
  fields as elementFilterFields,
  reducers as elementFilterReducers
} from './components/elementFilter';
import AdvancedEventOptions, {
  fields as advancedEventOptionsFields
} from './components/advancedEventOptions';
import extensionViewReduxForm from '../extensionViewReduxForm';
import reduceReducers from 'reduce-reducers';

const timePlayedUnit = {
  SECOND: 'second',
  PERCENT: 'percent'
};

export class TimePlayed extends React.Component {
  render() {
    const { amount, unit } = this.props.fields;
    return (
      <div>
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
          className="u-gapLeft">
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
        <ElementFilter {...this.props.fields}/>
        <AdvancedEventOptions {...this.props.fields}/>
      </div>
    );
  }
}

const fields = ['amount', 'unit'].concat(elementFilterFields, advancedEventOptionsFields);

const validate = values => {
  const errors = {
    ...elementFilterReducers.validate({}, values)
  };

  if (isNaN(values.amount) || values.amount < 1) {
    errors.amount = 'Please specify a positive number';
  }

  return errors;
};

export default extensionViewReduxForm({
  fields,
  validate
})(TimePlayed);

export const reducers = {
  configToFormValues: reduceReducers(
    elementFilterReducers.configToFormValues,
    (values, options) => {
      return {
        ...values,
        unit: options.config.unit || timePlayedUnit.SECOND
      };
    }
  ),
  formValuesToConfig: reduceReducers(
    elementFilterReducers.formValuesToConfig,
    (config, values) => {
      return {
        ...config,
        amount: Number(values.amount)
      };
    }
  )
};
