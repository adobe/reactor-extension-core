import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Field, FieldArray } from 'redux-form';

import CoralField from '../components/coralField';
import MultipleItemEditor from './components/multipleItemEditor';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';

const renderItem = (field) => (
  <div data-row className="u-inlineBlock">
    <label className="u-gapRight">
      <span className="u-label">Hash</span>
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

const Hash = () => (
  <FieldArray
    name="hashes"
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

    if (!values.hashes) {
      values.hashes = [];
    }

    if (!values.hashes.length) {
      values.hashes.push({});
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

    const hashesErrors = (values.hashes || []).map(hash => {
      const result = {};

      if (!hash.value) {
        result.value = 'Please specify a hash.';
      }

      return result;
    });

    errors.hashes = hashesErrors;

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Hash);
