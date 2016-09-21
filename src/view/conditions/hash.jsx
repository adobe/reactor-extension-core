import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import createId from '../utils/createId';
import MultipleItemEditor from './components/multipleItemEditor';

class Hash extends React.Component {
  getKey = hash => hash.id.value;
  addRow = () => this.props.fields.hashes.addField({ id: createId() });
  removeRow = index => this.props.fields.hashes.removeField(index);


  renderItem = (hash) => (
    <div className="u-inlineBlock">
      <ValidationWrapper
        className="u-gapRight"
        error={ hash.value.touched && hash.value.error }
      >
        <label>
          <span className="u-label">Hash</span>
          <Textfield { ...hash.value } />
        </label>
      </ValidationWrapper>
      <RegexToggle
        value={ hash.value.value }
        valueIsRegex={ hash.valueIsRegex.value }
        onValueChange={ hash.value.onChange }
        onValueIsRegexChange={ hash.valueIsRegex.onChange }
      />
    </div>
  );

  render() {
    const { hashes } = this.props.fields;

    return (
      <MultipleItemEditor
        items={ hashes }
        renderItem={ this.renderItem }
        getKey={ this.getKey }
        onAddItem={ this.addRow }
        onRemoveItem={ this.removeRow }
      />
    );
  }
}

const formConfig = {
  fields: [
    'hashes[].id',
    'hashes[].value',
    'hashes[].valueIsRegex'
  ],
  settingsToFormValues(values, options) {
    values = {
      ...values,
      ...options.settings
    };

    if (!values.hashes) {
      values.hashes = [];
    }

    if (!values.hashes.length) {
      values.hashes.push({});
    }

    values.hashes = values.hashes.map(hash => ({
      ...hash,
      id: createId()
    }));

    return values;
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    // Don't let ID get into the settings since it's only used in the view.
    settings.hashes = values.hashes.map(hash => ({
      value: hash.value,
      valueIsRegex: hash.valueIsRegex
    }));

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    const hashesErrors = values.hashes.map(hash => {
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
