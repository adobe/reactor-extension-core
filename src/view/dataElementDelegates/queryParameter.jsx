import React from 'react';
import Coral from 'coralui-support-reduxform';
import { ValidationWrapper } from '@reactor/react-components';
import extensionViewReduxForm from '../extensionViewReduxForm';

class QueryParameter extends React.Component {
  render() {
    const { name, caseInsensitive } = this.props.fields;

    return (
      <div>
        <ValidationWrapper
          ref="nameWrapper"
          error={name.touched && name.error}
          className="u-gapRight">
          <label>
            <span className="u-label">URL Querystring Parameter Name</span>
            <Coral.Textfield ref="nameField" {...name}/>
          </label>
        </ValidationWrapper>
        <Coral.Checkbox ref="caseInsensitiveCheckbox" {...caseInsensitive}>
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
  settingsToFormValues(values, options) {
    return {
      ...values,
      caseInsensitive: options.settingsIsNew || options.settings.caseInsensitive
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
