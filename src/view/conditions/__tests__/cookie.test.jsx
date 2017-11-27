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
import Switch from '@coralui/react-coral/lib/Switch';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import { Field } from 'redux-form';
import Cookie, { formConfig } from '../cookie';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const fields = wrapper.find(Field);
  const nameField = fields.filterWhere(n => n.prop('name') === 'name');
  const nameTextfield = nameField.find(Textfield).node;
  const nameErrorTip = nameField.find(ErrorTip).node;
  const valueField = fields.filterWhere(n => n.prop('name') === 'value');
  const valueTextfield = valueField.find(Textfield).node;
  const valueErrorTip = valueField.find(ErrorTip).node;
  const valueRegexSwitch = wrapper.find(Switch).node;

  return {
    nameTextfield,
    nameErrorTip,
    valueTextfield,
    valueRegexSwitch,
    valueErrorTip
  };
};

describe('cookie condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Cookie, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      }
    });

    const { nameTextfield, valueTextfield, valueRegexSwitch } = getReactComponents(instance);

    expect(nameTextfield.props.value).toBe('foo');
    expect(valueTextfield.props.value).toBe('bar');
    expect(valueRegexSwitch.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameTextfield, valueTextfield, valueRegexSwitch } = getReactComponents(instance);

    nameTextfield.props.onChange('foo');
    valueTextfield.props.onChange('bar');
    valueRegexSwitch.props.onChange({ target: { checked: true } });

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      value: 'bar',
      valueIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { nameErrorTip, valueErrorTip } = getReactComponents(instance);

    expect(nameErrorTip).toBeDefined();
    expect(valueErrorTip).toBeDefined();
  });
});
