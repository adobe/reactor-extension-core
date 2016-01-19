import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import ValidationWrapper from '../components/validationWrapper';

export class LandingPage extends React.Component {
  render() {
    const { page, pageIsRegex } = this.props.fields;

    return (
      <div>
        <ValidationWrapper className="u-gapRight" error={page.touched && page.error}>
          <label>
            <span className="u-label">Landing Page</span>
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

const fields = [
  'page',
  'pageIsRegex'
];

const validate = values => {
  const errors = {};

  if (!values.page) {
    errors.page = 'Please specify a landing page.';
  }

  return errors;
};

export default extensionViewReduxForm({
  fields,
  validate
})(LandingPage);
