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
import DeviceType, { formConfig } from '../deviceType';

import bootstrap from '../../bootstrap';

const selectedDeviceTypes = ['Desktop', 'Android'];

// react-testing-library element selectors
const pageElements = {
  getDesktopCheckBox: () => screen.getByRole('checkbox', { name: /Desktop/i }),
  getAndroidCheckBox: () => screen.getByRole('checkbox', { name: /Android/i })
};

describe('device type condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(DeviceType, formConfig, extensionBridge));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        deviceTypes: selectedDeviceTypes
      }
    });

    expect(pageElements.getDesktopCheckBox().checked).toBeTrue();
    expect(pageElements.getAndroidCheckBox().checked).toBeTrue();
  });

  it('sets settings from form values', () => {
    expect(extensionBridge.getSettings()).toEqual({
      deviceTypes: []
    });

    fireEvent.click(pageElements.getAndroidCheckBox());
    expect(extensionBridge.getSettings()).toEqual({
      deviceTypes: ['Android']
    });

    fireEvent.click(pageElements.getDesktopCheckBox());
    expect(extensionBridge.getSettings()).toEqual({
      deviceTypes: ['Android', 'Desktop']
    });

    fireEvent.click(pageElements.getAndroidCheckBox());
    expect(extensionBridge.getSettings()).toEqual({
      deviceTypes: ['Desktop']
    });

    fireEvent.click(pageElements.getDesktopCheckBox());
    expect(extensionBridge.getSettings()).toEqual({
      deviceTypes: []
    });
  });
});
