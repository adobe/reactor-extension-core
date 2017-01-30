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
import { Field, FieldArray } from 'redux-form';
import { mount } from 'enzyme';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Switch from '@coralui/react-coral/lib/Switch';
import ErrorTip from '@reactor/react-components/lib/errorTip';

import extensionViewReduxForm from '../../../extensionViewReduxForm';
import ElementPropertiesEditor, { formConfig, ElementPropertyEditor } from '../elementPropertiesEditor';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const rows = wrapper.find(ElementPropertyEditor).map((row) => {
    const fields = row.find(Field);
    const nameField = fields.filterWhere(n => n.prop('name').indexOf('.name') !== -1);
    const valueField = fields.filterWhere(n => n.prop('name').indexOf('.value') !== -1);
    return {
      nameTextfield: nameField.find(Textfield).node,
      nameErrorTip: nameField.find(ErrorTip).node,
      valueTextfield: valueField.find(Textfield).node,
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

    let { rows } = getReactComponents(instance);

    rows[0].valueTextfield.props.onChange('foo');

    expect(extensionBridge.validate()).toBe(false);

    ({ rows } = getReactComponents(instance));

    expect(rows[0].nameErrorTip).toBeDefined();
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
