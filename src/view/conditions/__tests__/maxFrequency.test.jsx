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
import { TextField, Picker } from '@adobe/react-spectrum';
import MaxFrequency, { formConfig } from '../maxFrequency';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const countTextfield = wrapper.find(TextField);
  const unitSelect = wrapper.find(Picker);

  return {
    countTextfield,
    unitSelect
  };
};

describe('max frequency condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(MaxFrequency, formConfig, extensionBridge));
  });

  it('sets form values to defaults', () => {
    extensionBridge.init();

    const { unitSelect, countTextfield } = getReactComponents(instance);

    expect(unitSelect.props().value).toBe('pageView');
    expect(countTextfield.props().value).toBe('1');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        count: 3,
        unit: 'session'
      }
    });

    const { countTextfield, unitSelect } = getReactComponents(instance);

    expect(countTextfield.props().value).toBe('3');
    expect(unitSelect.props().value).toBe('session');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { unitSelect, countTextfield } = getReactComponents(instance);

    unitSelect.props().onChange('session');
    countTextfield.props().onChange('3');

    expect(extensionBridge.getSettings()).toEqual({
      count: 3,
      unit: 'session'
    });
  });

  it('sets errors if count is not greater or equal to 1', () => {
    extensionBridge.init({
      settings: {
        count: 5,
        unit: 'session'
      }
    });

    let { countTextfield } = getReactComponents(instance);

    countTextfield.props().onChange('-1');

    expect(extensionBridge.validate()).toBe(false);

    ({ countTextfield } = getReactComponents(instance));

    expect(countTextfield.props().validationState).toBe('invalid');

    countTextfield.props().onChange('');

    expect(extensionBridge.validate()).toBe(false);

    ({ countTextfield } = getReactComponents(instance));

    expect(countTextfield.props().validationState).toBe('invalid');
  });

  describe('visitor unit', () => {
    it('sets form values from settings', () => {
      extensionBridge.init({
        settings: {
          unit: 'visitor'
        }
      });

      const { countTextfield, unitSelect } = getReactComponents(instance);

      expect(countTextfield.exists()).toBe(false);
      expect(unitSelect.props().value).toBe('visitor');
    });

    it('sets settings from form values', () => {
      extensionBridge.init();

      const { unitSelect } = getReactComponents(instance);

      unitSelect.props().onChange('visitor');

      expect(extensionBridge.getSettings()).toEqual({
        unit: 'visitor'
      });
    });
  });
});
