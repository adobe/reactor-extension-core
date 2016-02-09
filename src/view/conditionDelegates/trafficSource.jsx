import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import ValidationWrapper from '../components/validationWrapper';

class TrafficSource extends React.Component {
  render() {
    const { source, sourceIsRegex } = this.props.fields;

    return (
      <div>
        <ValidationWrapper className="u-gapRight" error={source.touched && source.error}>
          <label>
            <span className="u-label coral-Form-fieldlabel">Traffic Source</span>
            <Coral.Textfield {...source}/>
          </label>
        </ValidationWrapper>
        <RegexToggle
          value={source.value}
          valueIsRegex={sourceIsRegex.value}
          onValueChange={source.onChange}
          onValueIsRegexChange={sourceIsRegex.onChange}/>
      </div>
    );
  }
}

const formConfig = {
  fields: [
    'source',
    'sourceIsRegex'
  ],
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.source) {
      errors.source = 'Please specify a traffic source.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(TrafficSource);
