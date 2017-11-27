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
import ErrorTip from '@reactor/react-components/lib/errorTip';
import { Field } from 'redux-form';
import Click, { formConfig } from '../click';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';
import AdvancedEventOptions from '../components/advancedEventOptions';

const getReactComponents = (wrapper) => {
  const checkboxes = wrapper.find(Checkbox);
  const fields = wrapper.find(Field);

  const delayLinkActivationCheckbox = checkboxes
    .filterWhere(n => n.prop('name') === 'delayLinkActivation').node;
  const elementSelectorField = fields.filterWhere(n => n.prop('name') === 'elementSelector');
  const elementSelectorTextfield = elementSelectorField.find(Textfield).node;
  const elementSelectorErrorTip = elementSelectorField.find(ErrorTip).node;
  const bubbleStopCheckbox = checkboxes.filterWhere(n => n.prop('name') === 'bubbleStop').node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;

  return {
    delayLinkActivationCheckbox,
    elementSelectorTextfield,
    bubbleStopCheckbox,
    elementSelectorErrorTip,
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
        delayLinkActivation: true,
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const {
      delayLinkActivationCheckbox,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(delayLinkActivationCheckbox.props.value).toBe(true);
    expect(elementSelectorTextfield.props.value).toBe('.foo');
    expect(bubbleStopCheckbox.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const {
      delayLinkActivationCheckbox,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    delayLinkActivationCheckbox.props.onChange(true);
    elementSelectorTextfield.props.onChange('.foo');
    bubbleStopCheckbox.props.onChange(true);

    const { delayLinkActivation, elementSelector, bubbleStop } = extensionBridge.getSettings();

    expect(delayLinkActivation).toBe(true);
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { elementSelectorErrorTip } = getReactComponents(instance);

    expect(elementSelectorErrorTip).toBeDefined();
  });
});
