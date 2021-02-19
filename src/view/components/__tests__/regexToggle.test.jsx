/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
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
import { fireEvent, render, screen } from '@testing-library/react';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import WrappedField from '../wrappedField';
import RegexToggle from '../regexToggle';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getRegexToggleSwitch: () => {
    return screen.getByRole('switch', { name: /regex/i });
  },
  getRegexTestButton: () => {
    return screen.getByRole('button', { name: /test/i });
  },
  queryForRegexTestButton: () => {
    return screen.queryByRole('button', { name: /test/i });
  }
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

  beforeEach(() => {
    extensionBridge = createExtensionBridge();

    spyOn(extensionBridge, 'openRegexTester').and.callFake(() => ({
      then(resolve) {
        resolve('bar');
      }
    }));

    window.extensionBridge = extensionBridge;

    render(bootstrap(ConnectedRegexToggle, formConfig));
    extensionBridge.init();
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

    expect(pageElements.getRegexToggleSwitch().checked).toBeTrue();
  });

  it('calls onChange from ValueIsRegex field when switch is toggled', () => {
    fireEvent.click(pageElements.getRegexToggleSwitch());

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

    fireEvent.click(pageElements.getRegexTestButton());

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

    expect(pageElements.getRegexToggleSwitch().checked).toBeTrue();
    expect(pageElements.getRegexTestButton()).toBeTruthy();
  });

  it('hides test link when valueIsRegex=false', () => {
    extensionBridge.init({
      settings: {}
    });

    expect(pageElements.getRegexToggleSwitch().checked).toBeFalse();
    expect(pageElements.queryForRegexTestButton()).toBeNull();
  });
});
