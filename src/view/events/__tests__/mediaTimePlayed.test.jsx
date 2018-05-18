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
import Select from '@react/react-spectrum/Select';
import WrappedField from '../../components/wrappedField';
import AdvancedEventOptions from '../components/advancedEventOptions';
import MediaTimePlayed, { formConfig } from '../mediaTimePlayed';
import bootstrap from '../../bootstrap';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';

const getReactComponents = (wrapper) => {
  const fields = wrapper.find(WrappedField);

  const amountField = fields.filterWhere(n => n.prop('name') === 'amount');
  const amountTextfield = amountField.find(Textfield).node;
  const unitSelect = wrapper.find(Select).node;
  const elementSelectorField = fields.filterWhere(n => n.prop('name') === 'elementSelector');
  const elementSelectorTextfield = elementSelectorField.find(Textfield).node;
  const bubbleStopCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name') === 'bubbleStop').node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;

  return {
    amountTextfield,
    unitSelect,
    elementSelectorTextfield,
    bubbleStopCheckbox,
    advancedEventOptions
  };
};

describe('time played event view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(MediaTimePlayed, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        amount: 55,
        unit: 'percent',
        bubbleStop: true
      }
    });

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const {
      amountTextfield,
      unitSelect,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(amountTextfield.props.value).toBe(55);
    expect(unitSelect.props.value).toBe('percent');
    expect(elementSelectorTextfield.props.value).toBe('.foo');
    expect(bubbleStopCheckbox.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      amountTextfield,
      elementSelectorTextfield,
      advancedEventOptions
    } = getReactComponents(instance);

    amountTextfield.props.onChange(45);
    elementSelectorTextfield.props.onChange('.foo');

    advancedEventOptions.toggleSelected();
    const { bubbleStopCheckbox } = getReactComponents(instance);
    bubbleStopCheckbox.props.onChange(true);

    const { amount, unit, elementSelector, bubbleStop } = extensionBridge.getSettings();
    expect(amount).toBe(45);
    expect(unit).toBe('second');
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { amountTextfield, elementSelectorTextfield } = getReactComponents(instance);

    expect(amountTextfield.props.invalid).toBe(true);
    expect(elementSelectorTextfield.props.invalid).toBe(true);
  });
});
