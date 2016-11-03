import React from 'react';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Select from '@coralui/redux-form-react-coral/lib/Select';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import extensionViewReduxForm from '../extensionViewReduxForm';
import { isNumber } from '../utils/validators';
import comparisonOperatorOptions from './comparisonOperatorOptions';

const WindowSize = () => (
  <div>
    <div>
      <label className="u-gapRight">
        <span className="u-label">The user&apos;s window size width is</span>
        <Field
          name="widthOperator"
          component={ Select }
          options={ comparisonOperatorOptions }
        />
      </label>
      <label>
        <Field
          name="width"
          className="u-gapRight"
          component={ DecoratedInput }
          inputComponent={ Textfield }
          inputClassName="u-smallTextfield"
        />
        <span>px</span>
      </label>
    </div>
    <div className="u-gapTop">
      <label className="u-gapRight">
        <span className="u-label">and height is</span>
        <Field
          name="heightOperator"
          component={ Select }
          options={ comparisonOperatorOptions }
        />
      </label>
      <label>
        <Field
          name="height"
          className="u-gapRight"
          component={ DecoratedInput }
          inputComponent={ Textfield }
          inputClassName="u-smallTextfield"
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
