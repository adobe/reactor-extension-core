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
import Domain, { formConfig } from '../domain';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getAdobeDomainCheckbox: () => {
    return screen.getByRole('checkbox', { name: /adobe.com/i });
  },
  getExampleDomainCheckbox: () => {
    return screen.getByRole('checkbox', { name: /example.com/i });
  }
};

const domains = ['adobe.com', 'example.com'];

const selectedDomains = ['adobe.com'];

describe('domain condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(Domain, formConfig, extensionBridge));
    extensionBridge.init({
      propertySettings: {
        domains
      }
    });
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        domains: selectedDomains
      },
      propertySettings: {
        domains
      }
    });

    expect(pageElements.getAdobeDomainCheckbox().checked).toBeTrue();
    expect(pageElements.getExampleDomainCheckbox().checked).toBeFalse();
  });

  it('sets settings from form values', () => {
    expect(extensionBridge.getSettings()).toEqual({
      domains: []
    });

    fireEvent.click(pageElements.getAdobeDomainCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      domains: ['adobe.com']
    });

    fireEvent.click(pageElements.getExampleDomainCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      domains: ['adobe.com', 'example.com']
    });

    fireEvent.click(pageElements.getAdobeDomainCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      domains: ['example.com']
    });

    fireEvent.click(pageElements.getExampleDomainCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      domains: []
    });
  });
});
