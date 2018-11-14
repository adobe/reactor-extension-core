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

import React from 'react';
import { mount } from 'enzyme';
import Switch from '@react/react-spectrum/Switch';
import WrappedField from '../wrappedField';

import RegexToggle from '../regexToggle';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const regexSwitch = wrapper.find(Switch);
  const testButton = wrapper.find('button');
  const testButtonContainer = wrapper.find('#testButtonContainer');

  return {
    regexSwitch,
    testButton,
    testButtonContainer
  };
};

const ConnectedRegexToggle = () => (
  <WrappedField
    name="valueIsRegex"
    component={RegexToggle}
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

describe('regex toggle', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();

    spyOn(extensionBridge, 'openRegexTester').and.callFake(() => ({
      then(resolve) {
        resolve('bar');
      }
    }));

    window.extensionBridge = extensionBridge;

    instance = mount(bootstrap(ConnectedRegexToggle, formConfig, extensionBridge));
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets switch to checked when valueIsRegex=true', () => {
    extensionBridge.init({
      settings: {
        valueIsRegex: true,
        value: 'foo'
      }
    });

    const { regexSwitch } = getReactComponents(instance);

    expect(regexSwitch.props().checked).toBe(true);
  });

  it('calls onChange from ValueIsRegex field when switch is toggled', () => {
    extensionBridge.init();

    const { regexSwitch } = getReactComponents(instance);

    regexSwitch.props().onChange(true);

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

    expect(extensionBridge.openRegexTester).toHaveBeenCalledWith({
      pattern: 'foo',
      flags: 'i'
    });
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

    expect(testButtonContainer.props().style.visibility).toBe('visible');
  });

  it('hides test link when valueIsRegex=false', () => {
    extensionBridge.init({
      settings: {}
    });

    const { testButtonContainer } = getReactComponents(instance);

    expect(testButtonContainer.props().style.visibility).toBe('hidden');
  });
});
