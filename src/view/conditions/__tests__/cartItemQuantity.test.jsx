/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Select from '@coralui/react-coral/lib/Select';
import { Field } from 'redux-form';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import CartItemQuantity from '../cartItemQuantity';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

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

describe('cart item quantity view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(CartItemQuantity, extensionBridge));
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
