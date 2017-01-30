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

import React from 'react';
import { mount } from 'enzyme';
import Switch from '@coralui/react-coral/lib/Switch';
import { Field } from 'redux-form';

import RegexToggle from '../regexToggle';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import extensionViewReduxForm from '../../extensionViewReduxForm';

const getReactComponents = (wrapper) => {
  const regexSwitch = wrapper.find(Switch).node;
  const testButton = wrapper.find('button');
  const testButtonContainer = wrapper.find('#testButtonContainer');

  return {
    regexSwitch,
    testButton,
    testButtonContainer
  };
};

let ConnectedRegexToggle = () => (
  <Field
    name="valueIsRegex"
    component={ RegexToggle }
    valueFieldName="value"
  />
);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  }
};

ConnectedRegexToggle = extensionViewReduxForm(formConfig)(ConnectedRegexToggle);

describe('regex toggle', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();

    spyOn(extensionBridge, 'openRegexTester').and.callFake((value, callback) => {
      callback('bar');
    });

    window.extensionBridge = extensionBridge;

    instance = mount(getFormComponent(ConnectedRegexToggle, extensionBridge));
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets switch to checked when valueIsRegex=true', () => {
    extensionBridge.init({
      settings: {
        valueIsRegex: true
      }
    });

    const { regexSwitch } = getReactComponents(instance);

    expect(regexSwitch.props.checked).toBe(true);
  });

  it('calls onChange from ValueIsRegex field when switch is toggled', () => {
    extensionBridge.init();

    const { regexSwitch } = getReactComponents(instance);

    regexSwitch.props.onChange({
      target: {
        checked: true
      }
    });

    expect(extensionBridge.getSettings()).toEqual({
      valueIsRegex: true
    });
  });

  it('supports regex testing+updating workflow', () => {
    extensionBridge.init({
      settings: {
        valueIsRegex: true,
        value: 'foo'
      }
    });

    const { testButton } = getReactComponents(instance);

    testButton.simulate('click');

    expect(extensionBridge.openRegexTester).toHaveBeenCalledWith('foo', jasmine.any(Function));
    expect(extensionBridge.getSettings()).toEqual({
      valueIsRegex: true,
      value: 'bar'
    });
  });

  it('shows test link when valueIsRegex=true', () => {
    extensionBridge.init({
      settings: {
        valueIsRegex: true
      }
    });

    const { testButtonContainer } = getReactComponents(instance);

    expect(testButtonContainer.node.style.visibility).toBe('visible');
  });

  it('hides test link when valueIsRegex=false', () => {
    extensionBridge.init({
      settings: {}
    });

    const { testButtonContainer } = getReactComponents(instance);

    expect(testButtonContainer.node.style.visibility).toBe('hidden');
  });
});
