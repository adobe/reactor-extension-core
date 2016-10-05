import React from 'react';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Fields } from 'redux-form';

import CoralField from '../../components/coralField';
import RegexToggle from '../../components/regexToggle';

export const ElementPropertyEditor = ({ field, remove }) => (
  <div className="u-gapBottom">
    <CoralField
      placeholder="Property"
      name={ `${field}.name` }
      component={ Textfield }
      supportValidation
    />
    <span className="u-label u-gapLeft">=</span>
    <CoralField
      className="u-gapRight"
      placeholder="Value"
      name={ `${field}.value` }
      component={ Textfield }
    />
    <Fields
      names={ [`${field}.value`, `${field}.valueIsRegex`] }
      component={ RegexToggle }
    />
    <Button
      className="u-gapBottom"
      variant="minimal"
      icon="close"
      iconSize="XS"
      onClick={ remove }
    />
  </div>
);

export default ({ fields = [] }) => (
  <div>
    {
      fields.map((field, index) => (
        <ElementPropertyEditor
          key={ field }
          field={ field }
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

        // If this seems strange, check http://eslint.org/docs/rules/no-prototype-builtins.
        if (!{}.hasOwnProperty.call(elementProperty, 'value')) {
          elementProperty.value = '';
        }

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
