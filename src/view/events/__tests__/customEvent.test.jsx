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
import WrappedField from '../../components/wrappedField';
import CustomEvent, { formConfig } from '../customEvent';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';
import AdvancedEventOptions from '../components/advancedEventOptions';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const fields = wrapper.find(WrappedField);

  const typeField = fields.filterWhere(n => n.prop('name') === 'type');
  const typeTextfield = typeField.find(Textfield);
  const elementSelectorField = fields.filterWhere(n => n.prop('name') === 'elementSelector');
  const elementSelectorTextfield = elementSelectorField.find(Textfield);
  const bubbleStopCheckbox = wrapper.find(Checkbox)
    .filterWhere(n => n.prop('name') === 'bubbleStop');
  const advancedEventOptions = wrapper.find(AdvancedEventOptions);

  return {
    typeTextfield,
    elementSelectorTextfield,
    bubbleStopCheckbox,
    advancedEventOptions
  };
};

describe('custom event event view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(CustomEvent, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        type: 'bar',
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.instance().toggleSelected();

    const {
      typeTextfield,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(typeTextfield.props().value).toBe('bar');
    expect(elementSelectorTextfield.props().value).toBe('.foo');
    expect(bubbleStopCheckbox.props().value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.instance().toggleSelected();

    const {
      typeTextfield,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    typeTextfield.props().onChange('bar');
    elementSelectorTextfield.props().onChange('.foo');
    bubbleStopCheckbox.props().onChange(true);

    const { type, elementSelector, bubbleStop } = extensionBridge.getSettings();

    expect(type).toBe('bar');
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { typeTextfield, elementSelectorTextfield } = getReactComponents(instance);

    expect(typeTextfield.props().invalid).toBe(true);
    expect(elementSelectorTextfield.props().invalid).toBe(true);
  });
});
