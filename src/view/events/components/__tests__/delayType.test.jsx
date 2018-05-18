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
import Radio from '@react/react-spectrum/Radio';
import Textfield from '@react/react-spectrum/Textfield';
import DelayType, { formConfig } from '../delayType';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const radios = wrapper.find(Radio);

  const delayRadio = radios.filterWhere(n => n.prop('value') === 'delay').node;
  const immediateRadio = radios.filterWhere(n => n.prop('value') === 'immediate').node;
  const delayTextfield = wrapper.find(Textfield).node;

  return {
    delayRadio,
    delayTextfield,
    immediateRadio
  };
};

describe('delayType', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(DelayType, formConfig, extensionBridge));
  });

  describe('sets form values', () => {
    it('when settings contains delay value', () => {
      extensionBridge.init({
        settings: {
          delay: 500
        }
      });

      const { delayRadio, delayTextfield } = getReactComponents(instance);

      expect(delayRadio.props.checked).toBe(true);
      expect(delayTextfield.props.value).toBe(500);
    });

    it('when settings doesn\'t contain delay value', () => {
      extensionBridge.init({ settings: {} });

      const { immediateRadio } = getReactComponents(instance);

      expect(immediateRadio.props.checked).toBe(true);
    });
  });

  it('has the specific element radio button selected', () => {
    extensionBridge.init();

    const { immediateRadio } = getReactComponents(instance);

    expect(immediateRadio.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { delayRadio, delayTextfield } = getReactComponents(instance);

    delayRadio.props.onChange('delay', { stopPropagation() {} });
    delayTextfield.props.onChange(100);

    expect(extensionBridge.getSettings()).toEqual({
      delay: 100
    });
  });

  it('sets settings without delay when trigger immediately is selected and delay ' +
    'contains a value', () => {
    extensionBridge.init();

    const { delayTextfield, immediateRadio } = getReactComponents(instance);

    delayTextfield.props.onChange(100);
    immediateRadio.props.onChange('immediately', { stopPropagation() {} });

    expect(extensionBridge.getSettings().delay).toBeUndefined();
  });

  it('sets error if delay radio is selected and the delay field is empty', () => {
    extensionBridge.init();

    const { delayRadio } = getReactComponents(instance);

    delayRadio.props.onChange('delay', { stopPropagation() {} });

    expect(extensionBridge.validate()).toBe(false);

    const { delayTextfield } = getReactComponents(instance);

    expect(delayTextfield.props.invalid).toBe(true);
  });

  it('sets error if the delay field is not a number', () => {
    extensionBridge.init();

    const { delayRadio, delayTextfield } = getReactComponents(instance);

    delayRadio.props.onChange('delay', { stopPropagation() {} });
    delayTextfield.props.onChange('aaa');

    expect(extensionBridge.validate()).toBe(false);

    expect(delayTextfield.props.invalid).toBe(true);
  });
});
