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
import Sessions from '../sessions';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const operatorSelect = wrapper.find(Select).node;
  const countTextfield = wrapper.find(Textfield).node;
  const countErrorTip = wrapper.find(ErrorTip).node;

  return {
    operatorSelect,
    countTextfield,
    countErrorTip
  };
};

describe('sessions view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Sessions, extensionBridge));
  });

  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorSelect } = getReactComponents(instance);

    expect(operatorSelect.props.value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operator: '=',
        count: 100
      }
    });

    const { operatorSelect, countTextfield } = getReactComponents(instance);

    expect(operatorSelect.props.value).toBe('=');
    expect(countTextfield.props.value).toBe(100);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatorSelect, countTextfield } = getReactComponents(instance);

    operatorSelect.props.onChange({ value: '=' });
    countTextfield.props.onChange(100);

    expect(extensionBridge.getSettings()).toEqual({
      operator: '=',
      count: 100
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countErrorTip } = getReactComponents(instance);

    expect(countErrorTip).toBeDefined();
  });

  it('sets error if count value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countTextfield, countErrorTip } = getReactComponents(instance);

    countTextfield.props.onChange('12.abc');

    expect(countErrorTip).toBeDefined();
  });
});
