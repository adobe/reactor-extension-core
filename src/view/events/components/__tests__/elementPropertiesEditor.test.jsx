/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import { mount } from 'enzyme';
import Button from '@react/react-spectrum/Button';
import Textfield from '@react/react-spectrum/Textfield';
import RegexToggle from '../../../components/regexToggle';
import WrappedField from '../../../components/wrappedField';
import ElementPropertiesEditor, { formConfig } from '../elementPropertiesEditor';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const rows = wrapper.find('[data-row]').map((row) => {
    const fields = row.find(WrappedField);
    const nameField = fields.filterWhere(n => n.prop('name').indexOf('.name') !== -1);
    const valueField = fields.filterWhere(n => n.prop('name').indexOf('.value') !== -1);
    return {
      nameTextfield: nameField.find(Textfield),
      valueTextfield: valueField.find(Textfield),
      valueRegexToggle: row.find(RegexToggle),
      removeButton: row.find(Button)
    };
  });

  const addButton = wrapper.find(Button).last();

  return {
    rows,
    addButton
  };
};

describe('elementPropertiesEditor', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(ElementPropertiesEditor, formConfig, extensionBridge));
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
    expect(rows[0].nameTextfield.props().value).toBe('some prop');
    expect(rows[0].valueTextfield.props().value).toBe('some value');
    expect(rows[0].valueRegexToggle.props().value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { rows } = getReactComponents(instance);

    rows[0].nameTextfield.props().onChange('some prop set');
    rows[0].valueTextfield.props().onChange('some value set');
    rows[0].valueRegexToggle.props().onChange(true);

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

    rows[0].valueTextfield.props().onChange('foo');

    expect(extensionBridge.validate()).toBe(false);

    ({ rows } = getReactComponents(instance));

    expect(rows[0].nameTextfield.props().invalid).toBe(true);
  });

  it('creates a new row when the add button is clicked', () => {
    extensionBridge.init();

    const { addButton } = getReactComponents(instance);
    addButton.props().onClick();

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
    rows[0].removeButton.props().onClick();

    ({ rows } = getReactComponents(instance));

    expect(rows.length).toBe(1);
    expect(rows[0].nameTextfield.props().value).toBe('some prop2');
  });
});
