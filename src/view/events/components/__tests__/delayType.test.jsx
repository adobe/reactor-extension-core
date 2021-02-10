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
import { TextField, RadioGroup } from '@adobe/react-spectrum';
import DelayType, { formConfig } from '../delayType';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

// TODO
const getReactComponents = (wrapper) => {
  wrapper.update();

  return {
    delayRadioGroup: wrapper.find(RadioGroup),
    delayTextfield: wrapper.find(TextField)
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

      const { delayRadioGroup, delayTextfield } = getReactComponents(instance);

      expect(delayRadioGroup.props().value).toBe('delay');
      expect(delayTextfield.props().value).toBe(500);
    });

    it("when settings doesn't contain delay value", () => {
      extensionBridge.init({ settings: {} });

      const { delayRadioGroup } = getReactComponents(instance);
      expect(delayRadioGroup.props().value).toBe('immediate');
    });
  });

  it('has the specific element radio button selected', () => {
    extensionBridge.init();

    const { delayRadioGroup } = getReactComponents(instance);
    expect(delayRadioGroup.props().value).toBe('immediate');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { delayRadioGroup } = getReactComponents(instance);
    delayRadioGroup.props().onChange('delay', { stopPropagation() {} });

    const { delayTextfield } = getReactComponents(instance);
    delayTextfield.props().onChange(100);

    expect(extensionBridge.getSettings()).toEqual({
      delay: 100
    });
  });

  it(
    'sets settings without delay when trigger immediately is selected and delay ' +
      'contains a value',
    () => {
      extensionBridge.init();

      const { delayRadioGroup } = getReactComponents(instance);
      delayRadioGroup.props().onChange('delay', { stopPropagation() {} });

      const { delayTextfield } = getReactComponents(instance);

      delayTextfield.props().onChange(100);
      delayRadioGroup.props().onChange('immediately', { stopPropagation() {} });

      expect(extensionBridge.getSettings().delay).toBeUndefined();
    }
  );

  it('sets error if delay radio is selected and the delay field is empty', () => {
    extensionBridge.init();

    const { delayRadioGroup } = getReactComponents(instance);
    delayRadioGroup.props().onChange('delay', { stopPropagation() {} });

    expect(extensionBridge.validate()).toBe(false);

    const { delayTextfield } = getReactComponents(instance);
    expect(delayTextfield.props().validationState).toBe('invalid');
  });

  it('sets error if the delay field is not a number', () => {
    extensionBridge.init();

    const { delayRadioGroup } = getReactComponents(instance);
    delayRadioGroup.props().onChange('delay', { stopPropagation() {} });

    let { delayTextfield } = getReactComponents(instance);
    delayTextfield.props().onChange('aaa');

    expect(extensionBridge.validate()).toBe(false);

    ({ delayTextfield } = getReactComponents(instance));
    expect(delayTextfield.props().validationState).toBe('invalid');
  });
});
