import React from 'react';
import { FieldArray } from 'redux-form';
import { mount } from 'enzyme';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Switch from '@coralui/react-coral/lib/Switch';
import { ValidationWrapper } from '@reactor/react-components';
import CoralField from '../../../components/coralField';


import extensionViewReduxForm from '../../../extensionViewReduxForm';
import ElementPropertiesEditor, { formConfig, ElementPropertyEditor } from '../elementPropertiesEditor';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const rows = wrapper.find(ElementPropertyEditor).map(row => {
    const textfields = row.find(Textfield).nodes;
    return {
      nameTextfield: textfields[0],
      nameWrapper: row.find(CoralField).filterWhere(n => n.prop('name').includes('.name'))
        .find(ValidationWrapper).node,
      valueTextfield: textfields[1],
      valueRegexSwitch: row.find(Switch).node,
      removeButton: row.find(Button).filterWhere(n => n.prop('icon') === 'close').node
    };
  });

  const addButton = wrapper.find(Button).filterWhere(n => n.prop('icon') !== 'close').node;

  return {
    rows,
    addButton
  };
};

describe('elementPropertiesEditor', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(() => (
      <FieldArray
        component={ ElementPropertiesEditor }
        name="elementProperties"
      />
    ));
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementProperties: [
          {
            name: 'some prop',
            value: 'some value',
            valueIsRegex: true
          }
        ]
      }
    });

    const { rows } = getReactComponents(instance);
    expect(rows[0].nameTextfield.props.value).toBe('some prop');
    expect(rows[0].valueTextfield.props.value).toBe('some value');
    expect(rows[0].valueRegexSwitch.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { rows } = getReactComponents(instance);

    rows[0].nameTextfield.props.onChange('some prop set');
    rows[0].valueTextfield.props.onChange('some value set');
    rows[0].valueRegexSwitch.props.onChange({ target: { checked: true } });

    const { elementProperties } = extensionBridge.getSettings();
    expect(elementProperties).toEqual([
      {
        name: 'some prop set',
        value: 'some value set',
        valueIsRegex: true
      }
    ]);
  });

  it('sets error if element property name field is empty and value is not empty', () => {
    extensionBridge.init();

    const { rows } = getReactComponents(instance);

    rows[0].valueTextfield.props.onChange('foo');

    expect(extensionBridge.validate()).toBe(false);

    expect(rows[0].nameWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('creates a new row when the add button is clicked', () => {
    extensionBridge.init();

    const { addButton } = getReactComponents(instance);
    addButton.props.onClick();

    const { rows } = getReactComponents(instance);

    // First row is visible by default.
    expect(rows.length).toBe(2);
  });

  it('deletes a row when requested from row', () => {
    extensionBridge.init({
      settings: {
        elementProperties: [
          {
            name: 'some prop',
            value: 'some value',
            valueIsRegex: true
          },
          {
            name: 'some prop2',
            value: 'some value2',
            valueIsRegex: true
          }
        ]
      }
    });

    let { rows } = getReactComponents(instance);
    rows[0].removeButton.props.onClick();

    ({ rows } = getReactComponents(instance));

    expect(rows.length).toBe(1);
    expect(rows[0].nameTextfield.props.value).toBe('some prop2');
  });
});
