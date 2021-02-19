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

import { fireEvent, render, screen } from '@testing-library/react';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import OperatingSystem, { formConfig } from '../operatingSystem';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getWindowsCheckbox: () => screen.getByRole('checkbox', { name: /windows/i }),
  getUnixCheckbox: () => screen.getByRole('checkbox', { name: /unix/i })
};

describe('operating system condition view', () => {
  const selectedOperatingSystems = ['Windows', 'Unix'];
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(OperatingSystem, formConfig, extensionBridge));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operatingSystems: selectedOperatingSystems
      }
    });

    expect(pageElements.getWindowsCheckbox().checked).toBeTrue();
    expect(pageElements.getUnixCheckbox().checked).toBeTrue();
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    expect(extensionBridge.getSettings()).toEqual({
      operatingSystems: []
    });

    fireEvent.click(pageElements.getWindowsCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      operatingSystems: ['Windows']
    });

    fireEvent.click(pageElements.getUnixCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      operatingSystems: ['Windows', 'Unix']
    });

    fireEvent.click(pageElements.getWindowsCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      operatingSystems: ['Unix']
    });

    fireEvent.click(pageElements.getUnixCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      operatingSystems: []
    });
  });
});
