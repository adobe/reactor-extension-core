import React from 'react';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import { Field, FieldArray } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import MultipleItemEditor from './components/multipleItemEditor';

const renderItem = field => (
  <div data-row className="u-inlineBlock">
    <label className="u-gapRight">
      <span className="u-label">Path</span>
      <Field
        name={ `${field}.value` }
        component={ DecoratedInput }
        inputComponent={ Textfield }
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
    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    const pathsErrors = (values.paths || []).map((path) => {
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
