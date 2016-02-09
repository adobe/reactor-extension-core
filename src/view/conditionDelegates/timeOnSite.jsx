import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';
import ComparisonOperatorField from './components/comparisonOperatorField';

class TimeOnSite extends React.Component {
  render() {
    const { operator, minutes } = this.props.fields;

    return (
      <div>
        <div>
          <label className="u-gapRight">
            <span className="u-label">User has spent</span>
            <ComparisonOperatorField {...operator}/>
          </label>
          <ValidationWrapper error={minutes.touched && minutes.error}>
            <label>
              <Coral.Textfield {...minutes}/>
              <span className="u-label u-gapLeft">minutes on site</span>
            </label>
          </ValidationWrapper>
        </div>
      </div>
    );
  }
}

const formConfig = {
  fields: [
    'operator',
    'minutes'
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
      minutes: Number(values.minutes)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.minutes || isNaN(values.minutes)) {
      errors.minutes = 'Please specify a number of minutes.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(TimeOnSite);
