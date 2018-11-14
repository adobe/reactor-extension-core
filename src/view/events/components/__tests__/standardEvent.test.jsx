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
import Checkbox from '@react/react-spectrum/Checkbox';
import WrappedField from '../../../components/wrappedField';
import StandardEvent, { formConfig } from '../standardEvent';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';
import AdvancedEventOptions from '../advancedEventOptions';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const advancedEventOptions = wrapper.find(AdvancedEventOptions);
  const elementSelectorField = wrapper.find(WrappedField)
    .filterWhere(n => n.prop('name') === 'elementSelector');
  const elementSelectorTextfield = elementSelectorField.find(Textfield);
  const bubbleStopCheckbox = wrapper.find(Checkbox)
    .filterWhere(n => n.prop('name') === 'bubbleStop');

  return {
    elementSelectorTextfield,
    bubbleStopCheckbox,
    advancedEventOptions
  };
};

describe('standard event view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(StandardEvent, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.instance().toggleSelected();

    const { elementSelectorTextfield, bubbleStopCheckbox } = getReactComponents(instance);

    expect(elementSelectorTextfield.props().value).toBe('.foo');
    expect(bubbleStopCheckbox.props().value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.instance().toggleSelected();

    const { elementSelectorTextfield, bubbleStopCheckbox } = getReactComponents(instance);

    elementSelectorTextfield.props().onChange('.foo');
    bubbleStopCheckbox.props().onChange(true);

    const { elementSelector, bubbleStop } = extensionBridge.getSettings();
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { elementSelectorTextfield } = getReactComponents(instance);

    expect(elementSelectorTextfield.props().validationState).toBe('invalid');
  });
});
