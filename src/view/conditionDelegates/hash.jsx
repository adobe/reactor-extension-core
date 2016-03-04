import React from 'react';
import Coral from 'coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import ValidationWrapper from '../components/validationWrapper';
import createId from '../utils/createId';
import MultipleItemEditor from './components/multipleItemEditor';

class Hash extends React.Component {
  addRow = () => this.props.fields.hashes.addField({ id: createId() });
  removeRow = index => this.props.fields.hashes.removeField(index);
  getKey = hash => hash.id.value;

  renderItem = (hash, index) => {
    return (
      <div className="u-inlineBlock">
        <ValidationWrapper
          ref={`hashWrapper${index}`}
          className="u-gapRight"
          error={hash.value.touched && hash.value.error}>
          <label>
            <span className="u-label">Hash</span>
            <Coral.Textfield ref={`hashField${index}`} {...hash.value}/>
          </label>
        </ValidationWrapper>
        <RegexToggle
          ref={`hashRegexToggle${index}`}
          value={hash.value.value}
          valueIsRegex={hash.valueIsRegex.value}
          onValueChange={hash.value.onChange}
          onValueIsRegexChange={hash.valueIsRegex.onChange}/>
      </div>
    );
  };

  render() {
    const { hashes } = this.props.fields;

    return (
      <MultipleItemEditor
        ref="multipleItemEditor"
        items={hashes}
        renderItem={this.renderItem}
        getKey={this.getKey}
        onAddItem={this.addRow}
        onRemoveItem={this.removeRow}/>
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
      ...values
    };

    if (!values.hashes) {
      values.hashes = [];
    }

    if (!values.hashes.length) {
      values.hashes.push({});
    }

    values.hashes = values.hashes.map(hash => {
      return {
        ...hash,
        id: createId()
      };
    });

    return values;
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    settings.hashes = values.hashes.map(hash => {
      // Don't let ID get into the settings since it's only used in the view.
      return {
        value: hash.value,
        valueIsRegex: hash.valueIsRegex
      };
    });

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
