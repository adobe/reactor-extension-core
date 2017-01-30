/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import React from 'react';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import RegexToggle from '../../components/regexToggle';

export const ElementPropertyEditor = ({ field, remove }) => (
  <div className="u-gapBottom">
    <Field
      name={ `${field}.name` }
      placeholder="Property"
      component={ DecoratedInput }
      inputComponent={ Textfield }
    />
    <span className="u-label u-gapLeft">=</span>
    <Field
      name={ `${field}.value` }
      className="u-gapRight"
      placeholder="Value"
      component={ Textfield }
    />
    <Field
      name={ `${field}.valueIsRegex` }
      component={ RegexToggle }
      valueFieldName={ `${field}.value` }
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
      .map((elementProperty) => {
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
