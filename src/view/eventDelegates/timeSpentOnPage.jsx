import React from 'react';

import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';

class TimeSpentOnPage extends React.Component {
  render() {
    const { timeOnPage } = this.props.fields;
    return (
      <div>
        <label>
          <span className="u-label u-gapRight">Trigger after</span>
        </label>
        <ValidationWrapper
          ref="timeOnPageWrapper"
          error={timeOnPage.touched && timeOnPage.error}>
          <Coral.Textfield
            ref="timeOnPageField"
            {...timeOnPage}/>
        </ValidationWrapper>
        <label>
          <span className="u-label u-gapLeft">seconds spent on the page</span>
        </label>
      </div>
    );
  }
}

const formConfig = {
  fields: ['timeOnPage'],
  formValuesToConfig: (config, values) => {
    return {
      ...config,
      timeOnPage: Number(values.timeOnPage)
    };
  },
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    if (!values.timeOnPage || isNaN(values.timeOnPage)) {
      errors.timeOnPage = 'Please specify a positive number';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(TimeSpentOnPage);
