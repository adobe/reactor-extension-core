import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';
import DataElementNameField from './components/dataElementNameField';
import ComparisonOperatorField from './components/comparisonOperatorField';

export class PageViews extends React.Component {
  render() {
    const { operator, count, duration } = this.props.fields;

    return (
      <div>
        <div>
          <label className="u-gapRight">
            <span className="u-label">The user's number of page views are</span>
            <ComparisonOperatorField {...operator}/>
          </label>
          <ValidationWrapper error={count.touched && count.error}>
            <label>
              <span className="u-label">the value</span>
              <Coral.Textfield {...count}/>
            </label>
          </ValidationWrapper>
        </div>
        <div>
          <Coral.Radio
            {...duration}
            value="lifetime"
            checked={duration.value === 'lifetime'}>
            Lifetime
          </Coral.Radio>
          <Coral.Radio
            {...duration}
            value="session"
            checked={duration.value === 'session'}>
            Current Session
          </Coral.Radio>
        </div>
      </div>
    );
  }
}

const fields = [
  'operator',
  'count',
  'duration'
];

const validate = values => {
  const errors = {};

  if (!values.count || isNaN(values.count)) {
    errors.count = 'Please specify a number of page views.';
  }

  return errors;
};

export default extensionViewReduxForm({
  fields,
  validate
})(PageViews);

export const reducers = {
  configToFormValues(values, options) {
    values = {
      ...values
    };

    if (!options.config.operator) {
      values.operator = '>'
    }

    if (!options.config.duration) {
      values.duration = 'lifetime';
    }

    return values;
  },
  formValuesToConfig(config, values) {
    return {
      ...config,
      count: Number(values.count)
    };
  }
};
