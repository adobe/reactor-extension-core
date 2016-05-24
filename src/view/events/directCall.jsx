import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper } from '@reactor/react-components';

class DirectCall extends React.Component {
  render() {
    const { name } = this.props.fields;

    return (
      <ValidationWrapper ref="nameWrapper" error={name.touched && name.error}>
        <label>
          <span className="u-label">_satellite.track string</span>
          <Coral.Textfield ref="nameField" {...name}/>
        </label>
      </ValidationWrapper>
    );
  }
}

const formConfig = {
  fields: ['name'],
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.name) {
      errors.name = 'Please specify a rule name.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(DirectCall);
