import React from 'react';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Fields } from 'redux-form';

import Field from '../../components/field';
import RegexToggle from '../../components/regexToggle';

export const ElementPropertyEditor = (fields) => (
  <div className="u-gapBottom">
    <Field
      placeholder="Property"
      name={ fields.names[0] }
      component={ Textfield }
      supportValidation
    />
    <span className="u-label u-gapLeft">=</span>
    <Field
      className="u-gapRight"
      placeholder="Value"
      name={ fields.names[1] }
      component={ Textfield }
    />
    <Fields
      names={ [fields.names[1], fields.names[2]] }
      component={ RegexToggle }
    />
    <Button
      className="u-gapBottom"
      variant="minimal"
      icon="close"
      iconSize="XS"
      onClick={ fields.remove }
    />
  </div>
);

export default ({ fields = [] }) => (
  <div>
    {
      fields.map((field, index) => (
        <Fields
          key={ field }
          names={ [`${field}.name`, `${field}.value`, `${field}.valueIsRegex`] }
          component={ ElementPropertyEditor }
          remove={ fields.remove.bind(this, index) }
        />
      ))
    }
    <Button onClick={ () => fields.push({}) }>Add</Button>
  </div>
);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const elementProperties = settings.elementProperties || [];

    // Make sure there's always at least one element property. This is just so the view
    // always shows at least one row.
    if (!elementProperties.length) {
      elementProperties.push({});
    }

    return {
      ...values,
      elementProperties
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    let { elementProperties } = values;

    elementProperties = elementProperties
      .filter(elementProperty => elementProperty.name)
      .map(elementProperty => {
        elementProperty = {
          ...elementProperty
        };

        return elementProperty;
      });

    if (elementProperties.length) {
      settings.elementProperties = elementProperties;
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    errors.elementProperties = (values.elementProperties || []).map((item) => {
      const result = {};

      if (item.value && !item.name) {
        result.name = 'Please fill in the property name.';
      }

      return result;
    });

    return errors;
  }
};
