import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Field, FieldArray } from 'redux-form';

import CoralField from '../components/coralField';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import MultipleItemEditor from './components/multipleItemEditor';

const renderItem = (field) => (
  <div data-row className="u-inlineBlock">
    <label className="u-gapRight">
      <span className="u-label">Path</span>
      <CoralField
        name={ `${field}.value` }
        component={ Textfield }
        supportValidation
      />
    </label>
    <Field
      name={ `${field}.valueIsRegex` }
      component={ RegexToggle }
      valueFieldName={ `${field}.value` }
    />
  </div>
);

const Path = () => (
  <FieldArray
    name="paths"
    renderItem={ renderItem }
    component={ MultipleItemEditor }
  />
);

const formConfig = {
  settingsToFormValues(values, settings) {
    values = {
      ...values,
      ...settings
    };

    if (!values.paths) {
      values.paths = [];
    }

    if (!values.paths.length) {
      values.paths.push({});
    }

    return values;
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    // Don't let ID get into the settings since it's only used in the view.
    settings.paths = values.paths.map(path => ({
      value: path.value,
      valueIsRegex: path.valueIsRegex
    }));

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    const pathsErrors = (values.paths || []).map(path => {
      const result = {};

      if (!path.value) {
        result.value = 'Please specify a path.';
      }

      return result;
    });

    errors.paths = pathsErrors;

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Path);
