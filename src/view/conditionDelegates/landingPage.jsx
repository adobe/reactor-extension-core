import React from 'react';
import Coral from 'coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import { ValidationWrapper } from '@reactor/react-components';

class LandingPage extends React.Component {
  render() {
    const { page, pageIsRegex } = this.props.fields;

    return (
      <div>
        <ValidationWrapper
          ref="pageWrapper"
          className="u-gapRight"
          error={page.touched && page.error}>
          <label>
            <span className="u-label">Landing Page</span>
            <Coral.Textfield ref="pageField" {...page}/>
          </label>
        </ValidationWrapper>
        <RegexToggle
          ref="valueRegexToggle"
          value={page.value}
          valueIsRegex={pageIsRegex.value}
          onValueChange={page.onChange}
          onValueIsRegexChange={pageIsRegex.onChange}/>
      </div>
    );
  }
}

const formConfig = {
  fields: [
    'page',
    'pageIsRegex'
  ],
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.page) {
      errors.page = 'Please specify a landing page.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(LandingPage);
