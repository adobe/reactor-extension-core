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
import { RadioGroup } from '@adobe/react-spectrum';
import ElementFilter, { formConfig } from '../elementFilter';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';
import SpecificElements from '../specificElements';

const getReactComponents = (wrapper) => {
  wrapper.update();

  return {
    elementFilterRadioGroup: wrapper.find(RadioGroup),
    specificElements: wrapper.find(SpecificElements)
  };
};

describe('elementFilter', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(ElementFilter, formConfig, extensionBridge));
  });

  it('updates view properly when elementSelector is provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo'
      }
    });

    const { elementFilterRadioGroup, specificElements } = getReactComponents(
      instance
    );

    expect(elementFilterRadioGroup.props().value).toBe('specific');
    expect(specificElements).toBeDefined();
  });

  it('updates view properly when elementSelector is not provided', () => {
    extensionBridge.init({ settings: {} });

    const { elementFilterRadioGroup, specificElements } = getReactComponents(
      instance
    );

    expect(elementFilterRadioGroup.props().value).toBe('any');
    expect(specificElements.exists()).toBe(false);
  });

  it(
    'removes elementSelector and elementProperties from settings if any ' +
      'element radio is selected',
    () => {
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

      const { elementFilterRadioGroup } = getReactComponents(instance);

      elementFilterRadioGroup.props().onChange('any', { stopPropagation() {} });

      const {
        elementSelector,
        elementProperties
      } = extensionBridge.getSettings();

      expect(elementSelector).toBeUndefined();
      expect(elementProperties).toBeUndefined();
    }
  );

  it('includes specificElements errors if specific element radio is selected', () => {
    extensionBridge.init();

    const { elementFilterRadioGroup } = getReactComponents(instance);

    elementFilterRadioGroup.props().onChange('specific', {
      stopPropagation() {}
    });

    expect(extensionBridge.validate()).toBe(false);
  });

  it('excludes specificElements errors if any element radio is selected', () => {
    extensionBridge.init();

    const { elementFilterRadioGroup } = getReactComponents(instance);

    elementFilterRadioGroup.props().onChange('any', {
      stopPropagation() {}
    });

    expect(extensionBridge.validate()).toBe(true);
  });
});
