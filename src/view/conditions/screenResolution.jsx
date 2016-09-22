import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import extensionViewReduxForm from '../extensionViewReduxForm';
import ComparisonOperatorField from './components/comparisonOperatorField';
import { isNumber } from '../utils/validators';

const ScreenResolution = ({ ...props }) => {
  const { widthOperator, width, heightOperator, height } = props.fields;

  return (
    <div>
      <div>
        <label className="u-gapRight">
          <span className="u-label">The user's screen resolution width is</span>
          <ComparisonOperatorField { ...widthOperator } />
        </label>
        <ValidationWrapper type="width" error={ width.touched && width.error }>
          <label>
            <Textfield className="u-gapRight u-smallTextfield" { ...width } />
            <span>px</span>
          </label>
        </ValidationWrapper>
      </div>
      <div className="u-gapTop">
        <label className="u-gapRight">
          <span className="u-label">and height is</span>
          <ComparisonOperatorField { ...heightOperator } />
        </label>
        <ValidationWrapper type="height" error={ height.touched && height.error }>
          <label>
            <Textfield className="u-gapRight u-smallTextfield" { ...height } />
            <span>px</span>
          </label>
        </ValidationWrapper>
      </div>
    </div>
  );
};

const formConfig = {
  fields: [
    'widthOperator',
    'width',
    'heightOperator',
    'height'
  ],
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

export default extensionViewReduxForm(formConfig)(ScreenResolution);
