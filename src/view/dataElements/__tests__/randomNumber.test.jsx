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
import ErrorTip from '@reactor/react-components/lib/errorTip';
import { Field } from 'redux-form';
import RandomNumber, { formConfig } from '../randomNumber';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const fields = wrapper.find(Field);
  const minField = fields.filterWhere(n => n.prop('name') === 'min');
  const maxField = fields.filterWhere(n => n.prop('name') === 'max');
  const minTextfield = minField.find(Textfield).node;
  const maxTextfield = maxField.find(Textfield).node;
  const minErrorTip = minField.find(ErrorTip).node;
  const maxErrorTip = maxField.find(ErrorTip).node;

  return {
    minTextfield,
    maxTextfield,
    minErrorTip,
    maxErrorTip
  };
};

describe('random number data element view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(RandomNumber, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        min: 100,
        max: 200
      }
    });

    const { minTextfield, maxTextfield } = getReactComponents(instance);

    expect(minTextfield.props.value).toBe(100);
    expect(maxTextfield.props.value).toBe(200);
  });

  it('sets form values with defaults', () => {
    extensionBridge.init();

    const { minTextfield, maxTextfield } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(true);
    expect(minTextfield.props.value).toBe(0);
    expect(maxTextfield.props.value).toBe(1000000000);
  });

  it('sets default values and validate passes', () => {
    extensionBridge.init({
      settings: {
        min: 0,
        max: 1000000000
      }
    });

    expect(extensionBridge.validate()).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { minTextfield, maxTextfield } = getReactComponents(instance);
    minTextfield.props.onChange('100');
    maxTextfield.props.onChange('200');

    expect(extensionBridge.getSettings()).toEqual({
      min: 100,
      max: 200
    });
  });

  it('sets errors if values are not provided', () => {
    extensionBridge.init();

    const { minTextfield, maxTextfield } = getReactComponents(instance);
    minTextfield.props.onChange('');
    maxTextfield.props.onChange('');

    expect(extensionBridge.validate()).toBe(false);

    const { minErrorTip, maxErrorTip } = getReactComponents(instance);

    expect(minErrorTip).toBeDefined();
    expect(minErrorTip.props.children).toBe('Please specify a minimum integer.');

    expect(maxErrorTip).toBeDefined();
    expect(maxErrorTip.props.children).toBe('Please specify a maximum integer.');
  });

  it('sets errors if values are not integers', () => {
    extensionBridge.init();

    const { minTextfield, maxTextfield } = getReactComponents(instance);
    minTextfield.props.onChange('1.5');
    maxTextfield.props.onChange('asdf');

    expect(extensionBridge.validate()).toBe(false);

    const { minErrorTip, maxErrorTip } = getReactComponents(instance);

    expect(minErrorTip).toBeDefined();
    expect(maxErrorTip).toBeDefined();
  });

  it('sets errors if min is greater than max', () => {
    extensionBridge.init();

    const { minTextfield, maxTextfield } = getReactComponents(instance);
    minTextfield.props.onChange('200');
    maxTextfield.props.onChange('100');

    expect(extensionBridge.validate()).toBe(false);

    const { minErrorTip, maxErrorTip } = getReactComponents(instance);

    expect(minErrorTip).toBeDefined();
    expect(maxErrorTip).toBeDefined();
  });
});
