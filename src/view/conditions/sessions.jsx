import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper } from '@reactor/react-components';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';

class Sessions extends React.Component {
  render() {
    const { operator, count } = this.props.fields;

    return (
      <div>
        <div>
          <label className="u-gapRight">
            <span className="u-label">The user's number of sessions is</span>
            <ComparisonOperatorField ref="operatorField" {...operator}/>
          </label>
          <ValidationWrapper ref="countWrapper" error={count.touched && count.error}>
            <label>
              <span className="u-label">the value</span>
              <Coral.Textfield className="u-smallTextfield" ref="countField" {...count}/>
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
    'count'
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
      count: Number(values.count)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!isNumber(values.count)) {
      errors.count = 'Please specify a number of sessions.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Sessions);
