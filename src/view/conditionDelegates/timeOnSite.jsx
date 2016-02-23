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
            <ComparisonOperatorField ref="operatorField" {...operator}/>
          </label>
          <ValidationWrapper ref="minutesWrapper" error={minutes.touched && minutes.error}>
            <label>
              <Coral.Textfield className="u-smallTextfield" ref="minutesField" {...minutes}/>
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
  settingsToFormValues(values, options) {
    return {
      ...values,
      operator: options.settings.operator || '>'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
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
