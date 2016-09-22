import React from 'react';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Button from '@coralui/react-coral/lib/Button';

const onOpenCssSelector = (callback) => () => {
  window.extensionBridge.openCssSelector(callback);
};

export default ({ ...props }) => {
  const { elementSelector } = props.fields;

  return (
    <ValidationWrapper error={ elementSelector.touched && elementSelector.error }>
      <label>
        <span className="u-label">Elements matching the CSS selector</span>
        <Textfield { ...elementSelector } />
        <Button
          variant="minimal"
          iconSize="S"
          icon="target"
          onClick={ onOpenCssSelector(elementSelector.onChange) }
        />
      </label>
    </ValidationWrapper>
  );
};

export const formConfig = {
  fields: [
    'elementSelector'
  ],
  settingsToFormValues(values, options) {
    return {
      ...values,
      ...options.settings
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      elementSelector: values.elementSelector
    };
  }
};
