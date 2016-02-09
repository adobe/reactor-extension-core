import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import ValidationWrapper from '../components/validationWrapper';

class LandingPage extends React.Component {
  render() {
    const { page, pageIsRegex } = this.props.fields;

    return (
      <div>
        <ValidationWrapper className="u-gapRight" error={page.touched && page.error}>
          <label>
            <span className="u-label coral-Form-fieldlabel">Landing Page</span>
            <Coral.Textfield {...page}/>
          </label>
        </ValidationWrapper>
        <RegexToggle
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
