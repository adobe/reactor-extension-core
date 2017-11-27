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
import Switch from '@coralui/react-coral/lib/Switch';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import { Field } from 'redux-form';
import Change, { formConfig } from '../change';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';
import AdvancedEventOptions from '../components/advancedEventOptions';

const getReactComponents = (wrapper) => {
  const checkboxes = wrapper.find(Checkbox);
  const fields = wrapper.find(Field);

  const showValueFieldCheckbox = checkboxes
    .filterWhere(n => n.prop('name') === 'showValueField').node;
  const valueTextfield = fields.filterWhere(n => n.prop('name') === 'value').find(Textfield).node;
  const valueRegexSwitch =
    fields.filterWhere(n => n.prop('name') === 'valueIsRegex').find(Switch).node;
  const elementSelectorField = fields.filterWhere(n => n.prop('name') === 'elementSelector');
  const elementSelectorTextfield = elementSelectorField.find(Textfield).node;
  const elementSelectorErrorTip = elementSelectorField.find(ErrorTip).node;
  const bubbleStopCheckbox = checkboxes.filterWhere(n => n.prop('name') === 'bubbleStop').node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;

  return {
    showValueFieldCheckbox,
    valueTextfield,
    valueRegexSwitch,
    elementSelectorTextfield,
    bubbleStopCheckbox,
    elementSelectorErrorTip,
    advancedEventOptions
  };
};

describe('change event view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Change, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        value: 'abc',
        valueIsRegex: true,
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const {
      showValueFieldCheckbox,
      valueTextfield,
      valueRegexSwitch,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(showValueFieldCheckbox.props.value).toBe(true);
    expect(valueTextfield.props.value).toBe('abc');
    expect(valueRegexSwitch.props.checked).toBe(true);
    expect(elementSelectorTextfield.props.value).toBe('.foo');
    expect(bubbleStopCheckbox.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { showValueFieldCheckbox, advancedEventOptions } = getReactComponents(instance);
    showValueFieldCheckbox.props.onChange(true);
    advancedEventOptions.toggleSelected();

    const {
      valueTextfield,
      valueRegexSwitch,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    valueTextfield.props.onChange('abc');
    valueRegexSwitch.props.onChange({ target: { checked: true } });
    elementSelectorTextfield.props.onChange('.foo');
    bubbleStopCheckbox.props.onChange(true);

    const { value, valueIsRegex, elementSelector, bubbleStop } = extensionBridge.getSettings();

    expect(value).toBe('abc');
    expect(valueIsRegex).toBe(true);
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
