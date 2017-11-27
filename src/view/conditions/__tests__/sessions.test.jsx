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
import Textfield from '@coralui/react-coral/lib/Textfield';
import Select from '@coralui/react-coral/lib/Select';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import Sessions, { formConfig } from '../sessions';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const operatorSelect = wrapper.find(Select).node;
  const countTextfield = wrapper.find(Textfield).node;
  const countErrorTip = wrapper.find(ErrorTip).node;

  return {
    operatorSelect,
    countTextfield,
    countErrorTip
  };
};

describe('sessions condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Sessions, formConfig, extensionBridge));
  });

  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorSelect } = getReactComponents(instance);

    expect(operatorSelect.props.value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operator: '=',
        count: 100
      }
    });

    const { operatorSelect, countTextfield } = getReactComponents(instance);

    expect(operatorSelect.props.value).toBe('=');
    expect(countTextfield.props.value).toBe(100);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatorSelect, countTextfield } = getReactComponents(instance);

    operatorSelect.props.onChange({ value: '=' });
    countTextfield.props.onChange(100);

    expect(extensionBridge.getSettings()).toEqual({
      operator: '=',
      count: 100
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countErrorTip } = getReactComponents(instance);

    expect(countErrorTip).toBeDefined();
  });

  it('sets error if count value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countTextfield, countErrorTip } = getReactComponents(instance);

    countTextfield.props.onChange('12.abc');

    expect(countErrorTip).toBeDefined();
  });
});
