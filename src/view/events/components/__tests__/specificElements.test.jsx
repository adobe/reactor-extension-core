/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
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
import { Checkbox, TextField } from '@adobe/react-spectrum';
import WrappedField from '../../../components/wrappedField';
import SpecificElements, { formConfig } from '../specificElements';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';
import ElementPropertiesEditor from '../elementPropertiesEditor';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const showElementPropertiesCheckbox = wrapper.find(Checkbox);
  const elementPropertiesEditor = wrapper.find(ElementPropertiesEditor);
  const elementSelectorTextfield = wrapper
    .find(WrappedField)
    .filterWhere((n) => n.prop('name') === 'elementSelector')
    .find(TextField);

  return {
    showElementPropertiesCheckbox,
    elementPropertiesEditor,
    elementSelectorTextfield
  };
};

describe('specificElements', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(SpecificElements, formConfig, extensionBridge));
  });

  it('updates view properly when elementProperties provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            name: 'a',
            value: 'b'
          },
          {
            name: 'b',
            value: 'c'
          }
        ]
      }
    });

    const {
      showElementPropertiesCheckbox,
      elementPropertiesEditor
    } = getReactComponents(instance);
    expect(showElementPropertiesCheckbox.props().checked).toBe(true);
    expect(elementPropertiesEditor.exists()).toBe(true);
  });

  it('updates view properly when elementProperties not provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo'
      }
    });

    const {
      showElementPropertiesCheckbox,
      elementPropertiesEditor
    } = getReactComponents(instance);
    expect(showElementPropertiesCheckbox.props().checked).toBe(false);
    expect(elementPropertiesEditor.exists()).toBe(false);
  });

  it('removes elementProperties from settings if element properties hidden', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            name: 'a',
            value: 'b'
          }
        ]
      }
    });

    const { showElementPropertiesCheckbox } = getReactComponents(instance);

    showElementPropertiesCheckbox.props().onChange(false);

    expect(extensionBridge.getSettings().elementProperties).toBeUndefined();
  });

  it('sets error if elementSelector is not specified', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { elementSelectorTextfield } = getReactComponents(instance);

    expect(elementSelectorTextfield.props().validationState).toBe('invalid');
  });

  it('removes elementProperties error if element properties not shown', () => {
    // An element property with a value but not a name would typically create a validation error
    // if the element properties editor were visible.
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            value: 'b'
          }
        ]
      }
    });

    const { showElementPropertiesCheckbox } = getReactComponents(instance);

    showElementPropertiesCheckbox.props().onChange(false);

    expect(extensionBridge.validate()).toBe(true);
  });
});
