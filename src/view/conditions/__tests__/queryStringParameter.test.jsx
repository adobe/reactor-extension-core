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
import Switch from '@coralui/react-coral/lib/Switch';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import { Field } from 'redux-form';
import QueryStringParameter from '../queryStringParameter';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const fields = wrapper.find(Field);

  const nameField = fields.filterWhere(n => n.prop('name') === 'name');
  const nameTextfield = nameField.find(Textfield).node;
  const nameErrorTip = nameField.find(ErrorTip).node;
  const valueField = fields.filterWhere(n => n.prop('name') === 'value');
  const valueTextfield = valueField.find(Textfield).node;
  const valueErrorTip = valueField.find(ErrorTip).node;
  const valueRegexSwitch = wrapper.find(Switch).node;

  return {
    nameTextfield,
    nameErrorTip,
    valueTextfield,
    valueErrorTip,
    valueRegexSwitch
  };
};

describe('query string parameter view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(QueryStringParameter, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      }
    });

    const { nameTextfield, valueTextfield, valueRegexSwitch } = getReactComponents(instance);

    expect(nameTextfield.props.value).toBe('foo');
    expect(valueTextfield.props.value).toBe('bar');
    expect(valueRegexSwitch.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameTextfield, valueTextfield, valueRegexSwitch } = getReactComponents(instance);

    nameTextfield.props.onChange('foo');
    valueTextfield.props.onChange('bar');
    valueRegexSwitch.props.onChange({ target: { checked: true } });

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      value: 'bar',
      valueIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { nameErrorTip, valueErrorTip } = getReactComponents(instance);

    expect(nameErrorTip).toBeDefined();
    expect(valueErrorTip).toBeDefined();
  });
});
