import React from 'react';

import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper } from '@reactor/react-components';
import { isPositiveNumber } from '../utils/validators';

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
  formValuesToSettings: (settings, values) => {
    return {
      ...settings,
      timeOnPage: Number(values.timeOnPage)
    };
  },
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    if (!isPositiveNumber(values.timeOnPage)) {
      errors.timeOnPage = 'Please specify a positive number';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(TimeSpentOnPage);
