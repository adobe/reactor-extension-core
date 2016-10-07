import React from 'react';
import Icon from '@coralui/react-coral/lib/Icon';
import Tooltip from '@coralui/react-coral/lib/Tooltip';
import { Field } from 'redux-form';
import EditorButton from '@reactor/react-components/lib/reduxForm/editorButton';

import extensionViewReduxForm from '../extensionViewReduxForm';

const Custom = () => (
  <div>
    <Field
      name="source"
      component={ EditorButton }
    />
    <Tooltip
      className="u-tooltipMaxWidth"
      openOn="hover"
      content="Enter a script that must evaluate true/false to control whether this rule
      executes. Use this field to check for certain values like shopping cart size or item
      price, whether a user is logged in or registered, or anything else you can dream up."
    >
      <Icon icon="infoCircle" size="XS" className="u-inline-tooltip u-gapLeft" />
    </Tooltip>
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

    if (!values.source) {
      errors.source = 'Please provide custom script.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Custom);
