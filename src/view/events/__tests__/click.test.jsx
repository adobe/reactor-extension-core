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
import Checkbox from '@react/react-spectrum/Checkbox';
import WrappedField from '../../components/wrappedField';
import Click, { formConfig } from '../click';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';
import AdvancedEventOptions from '../components/advancedEventOptions';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const checkboxes = wrapper.find(Checkbox);
  const fields = wrapper.find(WrappedField);

  const delayLinkActivationCheckbox = checkboxes
    .filterWhere(n => n.prop('name') === 'delayLinkActivation');
  const anchorDelayField = fields.filterWhere(n => n.prop('name') === 'anchorDelay');
  const anchorDelayTextfield = anchorDelayField.find(Textfield);
  const elementSelectorField = fields.filterWhere(n => n.prop('name') === 'elementSelector');
  const elementSelectorTextfield = elementSelectorField.find(Textfield);
  const bubbleStopCheckbox = checkboxes.filterWhere(n => n.prop('name') === 'bubbleStop');
  const advancedEventOptions = wrapper.find(AdvancedEventOptions);

  return {
    delayLinkActivationCheckbox,
    elementSelectorTextfield,
    anchorDelayTextfield,
    bubbleStopCheckbox,
    advancedEventOptions
  };
};

describe('click event view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Click, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        anchorDelay: 101,
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.instance().toggleSelected();

    const {
      anchorDelayTextfield,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(anchorDelayTextfield.props().value).toBe(101);
    expect(elementSelectorTextfield.props().value).toBe('.foo');
    expect(bubbleStopCheckbox.props().value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.instance().toggleSelected();

    const {
      delayLinkActivationCheckbox,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    delayLinkActivationCheckbox.props().onChange(true);
    const { anchorDelayTextfield } = getReactComponents(instance);

    anchorDelayTextfield.props().onChange(101);
    elementSelectorTextfield.props().onChange('.foo');
    bubbleStopCheckbox.props().onChange(true);

    const { anchorDelay, elementSelector, bubbleStop } = extensionBridge.getSettings();

    expect(anchorDelay).toBe(101);
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets default anchor delay to 100', () => {
    extensionBridge.init();
    const { delayLinkActivationCheckbox } = getReactComponents(instance);
    delayLinkActivationCheckbox.props().onChange(true);

    const { anchorDelayTextfield } = getReactComponents(instance);
    expect(anchorDelayTextfield.props().value).toBe(100);
  });

  it('sets validation error when element selector is missing', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { elementSelectorTextfield } = getReactComponents(instance);

    expect(elementSelectorTextfield.props().validationState).toBe('invalid');
  });

  it('sets validation error when anchor delay is missing', () => {
    extensionBridge.init({
      elementSelector: 'div'
    });
    const { delayLinkActivationCheckbox } = getReactComponents(instance);
    delayLinkActivationCheckbox.props().onChange(true);

    let { anchorDelayTextfield } = getReactComponents(instance);
    anchorDelayTextfield.props().onChange('');

    expect(extensionBridge.validate()).toBe(false);

    ({ anchorDelayTextfield } = getReactComponents(instance));
    expect(anchorDelayTextfield.props().validationState).toBe('invalid');
  });
});
