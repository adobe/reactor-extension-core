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
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Radio from '@coralui/react-coral/lib/Radio';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import { Field } from 'redux-form';
import Hover from '../hover';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import AdvancedEventOptions from '../components/advancedEventOptions';

const getReactComponents = (wrapper) => {
  const fields = wrapper.find(Field);

  const elementSelectorField = fields.filterWhere(n => n.prop('name') === 'elementSelector');
  const elementSelectorTextfield = elementSelectorField.find(Textfield).node;
  const elementSelectorErrorTip = elementSelectorField.find(ErrorTip).node;
  const bubbleStopCheckbox = wrapper
    .find(Checkbox).filterWhere(n => n.prop('name') === 'bubbleStop').node;
  const delayField = fields.filterWhere(n => n.prop('name') === 'delay');
  const delayTextfield = delayField.find(Textfield).node;
  const delayErrorTip = delayField.find(ErrorTip).node;
  const delayRadio = wrapper.find(Radio).filterWhere(n => n.prop('value') === 'delay').node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;

  return {
    elementSelectorTextfield,
    elementSelectorErrorTip,
    bubbleStopCheckbox,
    delayTextfield,
    delayErrorTip,
    delayRadio,
    advancedEventOptions
  };
};

describe('hover view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Hover, extensionBridge));

    extensionBridge.init();

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        delay: 100,
        bubbleStop: true
      }
    });

    const {
      elementSelectorTextfield,
      delayTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(elementSelectorTextfield.props.value).toBe('.foo');
    expect(delayTextfield.props.value).toBe(100);
    expect(bubbleStopCheckbox.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    const { delayRadio } = getReactComponents(instance);
    delayRadio.props.onChange('delay');

    const {
      elementSelectorTextfield,
      delayTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    elementSelectorTextfield.props.onChange('.foo');
    delayTextfield.props.onChange(100);
    bubbleStopCheckbox.props.onChange(true);

    const { elementSelector, delay, bubbleStop } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
    expect(delay).toBe(100);
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    const {
      delayRadio
    } = getReactComponents(instance);

    delayRadio.props.onChange('delay');
    expect(extensionBridge.validate()).toBe(false);

    const {
      delayErrorTip,
      elementSelectorErrorTip
    } = getReactComponents(instance);

    expect(delayErrorTip).toBeDefined();
    expect(elementSelectorErrorTip).toBeDefined();
  });
});
