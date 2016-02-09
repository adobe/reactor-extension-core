import React from 'react';
import Coral from '../reduxFormCoralUI';
import ValidationWrapper from '../components/validationWrapper';
import extensionViewReduxForm from '../extensionViewReduxForm';

class QueryParameter extends React.Component {
  render() {
    const { name, caseInsensitive } = this.props.fields;

    return (
      <div>
        <ValidationWrapper error={name.touched && name.error} className="u-gapRight">
          <label>
            <span className="u-label coral-Form-fieldlabel">URL Querystring Parameter Name</span>
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

const formConfig = {
  fields: [
    'name',
    'caseInsensitive'
  ],
  configToFormValues(values, options) {
    return {
      ...values,
      caseInsensitive: options.configIsNew || options.config.caseInsensitive
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.name) {
      errors.name = 'Please specify a query string parameter name.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(QueryParameter);
