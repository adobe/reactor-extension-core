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
import Textfield from '@react/react-spectrum/Textfield';
import Radio from '@react/react-spectrum/Radio';
import WrappedField from '../../components/wrappedField';
import EntersViewport, { formConfig } from '../entersViewport';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const fields = wrapper.find(WrappedField);

  const elementSelectorField = fields.filterWhere(n => n.prop('name') === 'elementSelector');
  const elementSelectorTextfield = elementSelectorField.find(Textfield);
  const delayField = fields.filterWhere(n => n.prop('name') === 'delay');
  const delayTextfield = delayField.find(Textfield);
  const delayRadio = wrapper.find(Radio).filterWhere(n => n.prop('value') === 'delay');

  return {
    elementSelectorTextfield,
    delayTextfield,
    delayRadio
  };
};

describe('enters viewport event view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(EntersViewport, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        delay: 100
      }
    });

    const { elementSelectorTextfield, delayTextfield } = getReactComponents(instance);

    expect(elementSelectorTextfield.props().value).toBe('.foo');
    expect(delayTextfield.props().value).toBe(100);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { delayRadio } = getReactComponents(instance);
    delayRadio.props().onChange('delay', { stopPropagation() {} });

    const { elementSelectorTextfield, delayTextfield } = getReactComponents(instance);
    elementSelectorTextfield.props().onChange('.foo');
    delayTextfield.props().onChange(100);

    const { elementSelector, delay } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
    expect(delay).toBe(100);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const {
      delayRadio
    } = getReactComponents(instance);

    delayRadio.props().onChange('delay', { stopPropagation() {} });

    expect(extensionBridge.validate()).toBe(false);

    const {
      delayTextfield,
      elementSelectorTextfield
    } = getReactComponents(instance);

    expect(delayTextfield.props().invalid).toBe(true);
    expect(elementSelectorTextfield.props().invalid).toBe(true);
  });
});
