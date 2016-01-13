import React from 'react';
import Coral from '../reduxFormCoralUI';
import ValidationWrapper from '../components/validationWrapper';
import extensionViewReduxForm from '../extensionViewReduxForm';

export class QueryParam extends React.Component {
  render() {
    const { name, caseInsensitive } = this.props.fields;

    return (
      <div>
        <ValidationWrapper error={name.touched && name.error} className="u-gapRight">
          <label>
            <span className="u-label">URL Querystring Parameter Name:</span>
            <Coral.Textfield {...name}/>
          </label>
        </ValidationWrapper>
        <Coral.Checkbox {...caseInsensitive}>
          Ignore capitalization differences
        </Coral.Checkbox>
      </div>
    );
  }
}

const fields = [
  'name',
  'caseInsensitive'
];

const validate = values => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Please specify a query string parameter name.';
  }

  return errors;
};

export default extensionViewReduxForm({
  fields,
  validate
})(QueryParam);

export const reducers = {
  configToFormValues(values, options) {
    return {
      ...values,
      caseInsensitive: options.configIsNew || options.config.caseInsensitive
    };
  }
};
