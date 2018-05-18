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
import Sampling, { formConfig } from '../sampling';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const rateTextfield = wrapper.find(Textfield).node;

  return {
    rateTextfield
  };
};

describe('sampling condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Sampling, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        rate: 0.25
      }
    });

    const { rateTextfield } = getReactComponents(instance);

    expect(rateTextfield.props.value).toBe(25);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { rateTextfield } = getReactComponents(instance);

    rateTextfield.props.onChange('25');

    expect(extensionBridge.getSettings()).toEqual({
      rate: 0.25
    });
  });

  it('sets error if rate is not provided', () => {
    extensionBridge.init();

    const { rateTextfield } = getReactComponents(instance);

    rateTextfield.props.onChange('');
    expect(extensionBridge.validate()).toBe(false);
    expect(rateTextfield.props.invalid).toBe(true);
  });

  it('sets error if rate is not a number', () => {
    extensionBridge.init();

    const { rateTextfield } = getReactComponents(instance);

    rateTextfield.props.onChange('abc');
    expect(extensionBridge.validate()).toBe(false);
    expect(rateTextfield.props.invalid).toBe(true);
  });

  it('sets error if rate is less than 0', () => {
    extensionBridge.init();

    const { rateTextfield } = getReactComponents(instance);

    rateTextfield.props.onChange('-1');
    expect(extensionBridge.validate()).toBe(false);
    expect(rateTextfield.props.invalid).toBe(true);
  });

  it('sets error if rate is greater than 1', () => {
    extensionBridge.init();

    const { rateTextfield } = getReactComponents(instance);

    rateTextfield.props.onChange('101');
    expect(extensionBridge.validate()).toBe(false);
    expect(rateTextfield.props.invalid).toBe(true);
  });

  it('sets error if rate is not an integer', () => {
    extensionBridge.init();

    const { rateTextfield } = getReactComponents(instance);

    rateTextfield.props.onChange('55.55');
    expect(extensionBridge.validate()).toBe(false);
    expect(rateTextfield.props.invalid).toBe(true);
  });
});
