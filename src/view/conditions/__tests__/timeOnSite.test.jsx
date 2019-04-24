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
import Textfield from '@react/react-spectrum/Textfield';
import Select from '@react/react-spectrum/Select';
import TimeOnSite, { formConfig } from '../timeOnSite';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const operatorSelect = wrapper.find(Select);
  const minutesTextfield = wrapper.find(Textfield);

  return {
    operatorSelect,
    minutesTextfield
  };
};

describe('time on site condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(TimeOnSite, formConfig, extensionBridge));
  });

  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorSelect } = getReactComponents(instance);

    expect(operatorSelect.props().value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operator: '=',
        minutes: 100
      }
    });

    const { operatorSelect, minutesTextfield } = getReactComponents(instance);

    expect(operatorSelect.props().value).toBe('=');
    expect(minutesTextfield.props().value).toBe(100);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatorSelect, minutesTextfield } = getReactComponents(instance);

    operatorSelect.props().onChange('=');
    minutesTextfield.props().onChange(100);

    expect(extensionBridge.getSettings()).toEqual({
      operator: '=',
      minutes: 100
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { minutesTextfield } = getReactComponents(instance);

    expect(minutesTextfield.props().validationState).toBe('invalid');
  });

  it('sets error if count value is not a number', () => {
    extensionBridge.init();

    let { minutesTextfield } = getReactComponents(instance);

    minutesTextfield.props().onChange('12.abc');

    expect(extensionBridge.validate()).toBe(false);

    ({ minutesTextfield } = getReactComponents(instance));

    expect(minutesTextfield.props().validationState).toBe('invalid');
  });
});
