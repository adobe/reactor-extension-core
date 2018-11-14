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
import Select from '@react/react-spectrum/Select';
import PageViews, { formConfig } from '../pageViews';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const radios = wrapper.find(Radio);

  const lifetimeRadio = radios.filterWhere(n => n.prop('value') === 'lifetime');
  const sessionRadio = radios.filterWhere(n => n.prop('value') === 'session');
  const operatorSelect = wrapper.find(Select);
  const countTextfield = wrapper.find(Textfield);

  return {
    lifetimeRadio,
    sessionRadio,
    operatorSelect,
    countTextfield
  };
};

describe('page views condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(PageViews, formConfig, extensionBridge));
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
        count: 100,
        duration: 'session'
      }
    });

    const {
      operatorSelect,
      countTextfield,
      lifetimeRadio,
      sessionRadio
    } = getReactComponents(instance);

    expect(operatorSelect.props().value).toBe('=');
    expect(countTextfield.props().value).toBe(100);
    expect(lifetimeRadio.props().checked).toBe(false);
    expect(sessionRadio.props().checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatorSelect, countTextfield, sessionRadio } = getReactComponents(instance);

    operatorSelect.props().onChange('=');
    countTextfield.props().onChange(100);
    sessionRadio.props().onChange('session', { stopPropagation() {} });

    expect(extensionBridge.getSettings()).toEqual({
      operator: '=',
      count: 100,
      duration: 'session'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countTextfield } = getReactComponents(instance);

    expect(countTextfield.props().validationState).toBe('invalid');
  });

  it('sets error if count value is not a number', () => {
    extensionBridge.init();

    let { countTextfield } = getReactComponents(instance);

    countTextfield.props().onChange('12.abc');

    expect(extensionBridge.validate()).toBe(false);

    ({ countTextfield } = getReactComponents(instance));

    expect(countTextfield.props().validationState).toBe('invalid');
  });
});
