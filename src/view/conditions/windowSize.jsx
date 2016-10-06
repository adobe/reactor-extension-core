import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../extensionViewReduxForm';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';
import CoralField from '../components/coralField';

const WindowSize = () => (
  <div>
    <div>
      <label className="u-gapRight">
        <span className="u-label">The user's window size width is</span>
        <CoralField name="widthOperator" component={ ComparisonOperatorField } />
      </label>
      <label>
        <CoralField
          className="u-gapRight"
          componentClassName="u-smallTextfield"
          name="width"
          component={ Textfield }
          supportValidation
        />
        <span>px</span>
      </label>
    </div>
    <div className="u-gapTop">
      <label className="u-gapRight">
        <span className="u-label">and height is</span>
        <CoralField name="heightOperator" component={ ComparisonOperatorField } />
      </label>
      <label>
        <CoralField
          className="u-gapRight"
          componentClassName="u-smallTextfield"
          name="height"
          component={ Textfield }
          supportValidation
        />
        <span>px</span>
      </label>
    </div>
  </div>
);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings,
      widthOperator: settings.widthOperator || '>',
      heightOperator: settings.heightOperator || '>'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values,
      width: Number(values.width),
      height: Number(values.height)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!isNumber(values.width)) {
      errors.width = 'Please specify a number for width.';
    }

    if (!isNumber(values.height)) {
      errors.height = 'Please specify a number for height.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(WindowSize);
