import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import { ValidationWrapper } from '@reactor/react-components';
import createId from '../utils/createId';
import MultipleItemEditor from './components/multipleItemEditor';

class Path extends React.Component {
  getKey = path => path.id.value;
  addRow = () => this.props.fields.paths.addField({ id: createId() });
  removeRow = index => this.props.fields.paths.removeField(index);


  renderItem = (path) => (
    <div className="u-inlineBlock">
      <ValidationWrapper
        className="u-gapRight"
        error={ path.value.touched && path.value.error }
      >
        <label>
          <span className="u-label">Path</span>
          <Textfield { ...path.value } />
        </label>
      </ValidationWrapper>
      <RegexToggle
        value={ path.value.value }
        valueIsRegex={ path.valueIsRegex.value }
        onValueChange={ path.value.onChange }
        onValueIsRegexChange={ path.valueIsRegex.onChange }
      />
    </div>
  );

  render() {
    const { paths } = this.props.fields;

    return (
      <MultipleItemEditor
        items={ paths }
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
    'paths[].id',
    'paths[].value',
    'paths[].valueIsRegex'
  ],
  settingsToFormValues(values) {
    values = {
      ...values
    };

    if (!values.paths) {
      values.paths = [];
    }

    if (!values.paths.length) {
      values.paths.push({});
    }

    values.paths = values.paths.map(path => ({
      ...path,
      id: createId()
    }));

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

    const pathsErrors = values.paths.map(path => {
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
