import React from 'react';
import Icon from '@coralui/react-coral/lib/Icon';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Tooltip from '@coralui/react-coral/lib/Tooltip';
import { Fields } from 'redux-form';

import CoralField from '../components/coralField';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';


const Variable = () => (
  <div>
    <label className="u-gapRight">
      <span className="u-label">JS Variable Name</span>
      <CoralField
        name="name"
        component={ Textfield }
        supportValidation
      />
    </label>
    <label className="u-gapRight">
      <span className="u-label">JS Variable Value</span>
      <CoralField
        name="value"
        component={ Textfield }
        supportValidation
      />
    </label>
    <Tooltip
      className="u-tooltipMaxWidth"
      openOn="hover"
      content="Specify a text (string) value here. The rule will only fire if the specified
      variable contains this string. Note: If your variable contains a number, this will not
      work as expected."
    >
      <Icon icon="infoCircle" size="XS" className="u-inline-tooltip u-gapRight" />
    </Tooltip>
    <Fields
      names={ ['value', 'valueIsRegex'] }
      component={ RegexToggle }
    />
  </div>
);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.name) {
      errors.name = 'Please specify a variable name.';
    }

    if (!values.value) {
      errors.value = 'Please specify a variable value.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Variable);
