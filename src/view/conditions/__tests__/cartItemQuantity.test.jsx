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
import Select from '@coralui/react-coral/lib/Select';
import { Field } from 'redux-form';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import CartItemQuantity, { formConfig } from '../cartItemQuantity';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const fields = wrapper.find(Field);
  const dataElementField = fields.filterWhere(n => n.prop('name') === 'dataElement');
  const dataElementTextfield = dataElementField.find(Textfield).node;
  const dataElementErrorTip = dataElementField.find(ErrorTip).node;
  const quantityField = fields.filterWhere(n => n.prop('name') === 'quantity');
  const quantityTextfield = quantityField.find(Textfield).node;
  const quantityErrorTip = quantityField.find(ErrorTip).node;
  const operatorField = wrapper.find(Select).node;

  return {
    dataElementTextfield,
    dataElementErrorTip,
    operatorField,
    quantityTextfield,
    quantityErrorTip
  };
};

describe('cart item quantity condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(CartItemQuantity, formConfig, extensionBridge));
  });

  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorField } = getReactComponents(instance);

    expect(operatorField.props.value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        dataElement: 'foo',
        operator: '=',
        quantity: 12.50
      }
    });

    const { dataElementTextfield, operatorField, quantityTextfield } = getReactComponents(instance);

    expect(dataElementTextfield.props.value).toBe('foo');
    expect(operatorField.props.value).toBe('=');
    expect(quantityTextfield.props.value).toBe(12.50);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { dataElementTextfield, operatorField, quantityTextfield } = getReactComponents(instance);

    dataElementTextfield.props.onChange('foo');
    operatorField.props.onChange({ value: '=' });
    quantityTextfield.props.onChange('12.50');

    expect(extensionBridge.getSettings()).toEqual({
      dataElement: 'foo',
      operator: '=',
      quantity: 12.50
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { dataElementErrorTip, quantityErrorTip } = getReactComponents(instance);

    expect(dataElementErrorTip).toBeDefined();
    expect(quantityErrorTip).toBeDefined();
  });

  it('sets error if quantity value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { quantityTextfield, quantityErrorTip } = getReactComponents(instance);

    quantityTextfield.props.onChange('12.abc');

    expect(quantityErrorTip).toBeDefined();
  });
});
