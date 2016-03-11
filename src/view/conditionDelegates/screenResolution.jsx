import React from 'react';
import Coral from 'coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper } from '@reactor/react-components';
import ComparisonOperatorField from './components/comparisonOperatorField';

class ScreenResolution extends React.Component {
  render() {
    const { widthOperator, width, heightOperator, height } = this.props.fields;

    return (
      <div>
        <div>
          <label className="u-gapRight">
            <span className="u-label">The user's screen resolution width is</span>
            <ComparisonOperatorField ref="widthOperatorField" {...widthOperator}/>
          </label>
          <ValidationWrapper ref="widthWrapper" error={width.touched && width.error}>
            <label>
              <Coral.Textfield
                ref="widthField"
                className="u-gapRight u-smallTextfield"
                {...width}/>
              <span>px</span>
            </label>
          </ValidationWrapper>
        </div>
        <div className="u-gapTop">
          <label className="u-gapRight">
            <span className="u-label">and height is</span>
            <ComparisonOperatorField ref="heightOperatorField" {...heightOperator}/>
          </label>
          <ValidationWrapper ref="heightWrapper" error={height.touched && height.error}>
            <label>
              <Coral.Textfield
                ref="heightField"
                className="u-gapRight u-smallTextfield"
                {...height}/>
              <span>px</span>
            </label>
          </ValidationWrapper>
        </div>
      </div>
    );
  }
}

const formConfig = {
  fields: [
    'widthOperator',
    'width',
    'heightOperator',
    'height'
  ],
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.width || isNaN(values.width)) {
      errors.width = 'Please specify a number for width.';
    }

    if (!values.height || isNaN(values.height)) {
      errors.height = 'Please specify a number for height.';
    }

    return errors;
  },
  settingsToFormValues(values, options) {
    return {
      ...values,
      widthOperator: options.settings.widthOperator || '>',
      heightOperator: options.settings.heightOperator || '>'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      width: Number(values.width),
      height: Number(values.height)
    };
  }
};

export default extensionViewReduxForm(formConfig)(ScreenResolution);
