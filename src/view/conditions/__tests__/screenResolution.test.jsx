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
import ErrorTip from '@reactor/react-components/lib/errorTip';
import { Field } from 'redux-form';
import ScreenResolution from '../screenResolution';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const comparisonOperatorSelects = wrapper.find(Select);
  const fields = wrapper.find(Field);

  const widthOperatorSelect = comparisonOperatorSelects
    .filterWhere(n => n.prop('name') === 'widthOperator').node;
  const heightOperatorSelect = comparisonOperatorSelects
    .filterWhere(n => n.prop('name') === 'heightOperator').node;
  const widthField = fields.filterWhere(n => n.prop('name') === 'width');
  const widthTextfield = widthField.find(Textfield).node;
  const widthErrorTip = widthField.find(ErrorTip).node;
  const heightField = fields.filterWhere(n => n.prop('name') === 'height');
  const heightTextfield = heightField.find(Textfield).node;
  const heightErrorTip = heightField.find(ErrorTip).node;

  return {
    widthOperatorSelect,
    widthTextfield,
    widthErrorTip,
    heightOperatorSelect,
    heightTextfield,
    heightErrorTip
  };
};

describe('screen resolution view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(ScreenResolution, extensionBridge));
  });

  it('sets operators to greater than by default', () => {
    extensionBridge.init();

    const { widthOperatorSelect, heightOperatorSelect } = getReactComponents(instance);

    expect(widthOperatorSelect.props.value).toBe('>');
    expect(heightOperatorSelect.props.value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        widthOperator: '=',
        width: 100,
        heightOperator: '<',
        height: 200
      }
    });

    const {
      widthOperatorSelect,
      widthTextfield,
      heightOperatorSelect,
      heightTextfield
    } = getReactComponents(instance);

    expect(widthOperatorSelect.props.value).toBe('=');
    expect(widthTextfield.props.value).toBe(100);
    expect(heightOperatorSelect.props.value).toBe('<');
    expect(heightTextfield.props.value).toBe(200);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      widthOperatorSelect,
      widthTextfield,
      heightOperatorSelect,
      heightTextfield
    } = getReactComponents(instance);

    widthOperatorSelect.props.onChange({ value: '=' });
    widthTextfield.props.onChange(100);
    heightOperatorSelect.props.onChange({ value: '<' });
    heightTextfield.props.onChange(200);

    expect(extensionBridge.getSettings()).toEqual({
      widthOperator: '=',
      width: 100,
      heightOperator: '<',
      height: 200
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      widthErrorTip,
      heightErrorTip
    } = getReactComponents(instance);

    expect(widthErrorTip).toBeDefined();
    expect(heightErrorTip).toBeDefined();
  });

  it('sets errors if values are not numbers', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      widthTextfield,
      widthErrorTip,
      heightTextfield,
      heightErrorTip
    } = getReactComponents(instance);

    widthTextfield.props.onChange('12.abc');
    heightTextfield.props.onChange('12.abc');

    expect(widthErrorTip).toBeDefined();
    expect(heightErrorTip).toBeDefined();
  });
});
