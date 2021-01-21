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
import { TextField, Checkbox, RadioGroup } from '@adobe/react-spectrum';
import WrappedField from '../../components/wrappedField';
import Hover, { formConfig } from '../hover';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';
import AdvancedEventOptions from '../components/advancedEventOptions';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const fields = wrapper.find(WrappedField);

  const elementSelectorField = fields.filterWhere(
    (n) => n.prop('name') === 'elementSelector'
  );
  const elementSelectorTextfield = elementSelectorField.find(TextField);
  const bubbleStopCheckbox = wrapper
    .find(Checkbox)
    .filterWhere((n) => n.prop('name') === 'bubbleStop');
  const delayField = fields.filterWhere((n) => n.prop('name') === 'delay');
  const delayTextfield = delayField.find(TextField);
  const delayRadioGroup = wrapper.find(RadioGroup);

  const advancedEventOptions = wrapper.find(AdvancedEventOptions);

  return {
    elementSelectorTextfield,
    bubbleStopCheckbox,
    delayTextfield,
    delayRadioGroup,
    advancedEventOptions
  };
};

describe('hover event view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Hover, formConfig, extensionBridge));

    extensionBridge.init();

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.instance().toggleSelected();
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

    expect(elementSelectorTextfield.props().value).toBe('.foo');
    expect(delayTextfield.props().value).toBe(100);
    expect(bubbleStopCheckbox.props().value).toBe(true);
  });

  it('sets settings from form values', () => {
    const { delayRadioGroup } = getReactComponents(instance);
    delayRadioGroup.props().onChange('delay', { stopPropagation() {} });

    const {
      elementSelectorTextfield,
      delayTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    elementSelectorTextfield.props().onChange('.foo');
    delayTextfield.props().onChange(100);
    bubbleStopCheckbox.props().onChange(true);

    const {
      elementSelector,
      delay,
      bubbleStop
    } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
    expect(delay).toBe(100);
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    const { delayRadioGroup } = getReactComponents(instance);

    delayRadioGroup.props().onChange('delay', { stopPropagation() {} });
    expect(extensionBridge.validate()).toBe(false);

    const { delayTextfield, elementSelectorTextfield } = getReactComponents(
      instance
    );

    expect(delayTextfield.props().validationState).toBe('invalid');
    expect(elementSelectorTextfield.props().validationState).toBe('invalid');
  });
});
