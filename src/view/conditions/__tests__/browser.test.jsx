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
import Browser, { formConfig } from '../browser';
import bootstrap from '../../bootstrap';

const selectedBrowsers = ['Chrome', 'Safari'];

// react-testing-library element selectors
const pageElements = {
  getChromeCheckbox: () => screen.getByRole('checkbox', { name: /chrome/i }),
  getSafariCheckbox: () => {
    return screen.getByRole('checkbox', { name: 'Safari' });
  },
  getMobileSafariCheckbox: () => {
    return screen.getByRole('checkbox', {
      name: 'Mobile Safari'
    });
  }
};

describe('browser condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(Browser, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('The expected number of checkboxes are on the page', () => {
    expect(screen.getAllByRole('checkbox').length).toBe(6);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        browsers: selectedBrowsers
      }
    });

    expect(pageElements.getChromeCheckbox().checked).toBe(true);
    expect(pageElements.getSafariCheckbox().checked).toBe(true);
    expect(pageElements.getMobileSafariCheckbox().checked).toBe(false);
  });

  it('sets settings from form values', () => {
    expect(extensionBridge.getSettings()).toEqual({
      browsers: []
    });

    fireEvent.click(pageElements.getSafariCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      browsers: ['Safari']
    });

    fireEvent.click(pageElements.getChromeCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      browsers: ['Safari', 'Chrome']
    });

    fireEvent.click(pageElements.getMobileSafariCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      browsers: ['Safari', 'Chrome', 'Mobile Safari']
    });

    fireEvent.click(pageElements.getChromeCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      browsers: ['Safari', 'Mobile Safari']
    });

    fireEvent.click(pageElements.getSafariCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      browsers: ['Mobile Safari']
    });

    fireEvent.click(pageElements.getMobileSafariCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      browsers: []
    });
  });
});
