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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import Configuration, { formConfig } from '../configuration';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getCSPNonceTextBox: () => {
    return screen.getByRole('textbox', { name: /nonce/i });
  }
};

describe('extension configuration view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(Configuration, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        cspNonce: '%foo%'
      }
    });

    expect(pageElements.getCSPNonceTextBox().value).toBe('%foo%');
  });

  it('sets settings from form values', () => {
    userEvent.type(pageElements.getCSPNonceTextBox(), '%foo%');

    expect(extensionBridge.getSettings()).toEqual({
      cspNonce: '%foo%'
    });
  });

  it('passes validation when cspNonce is not provided', () => {
    extensionBridge.init({
      settings: {}
    });
    expect(extensionBridge.validate()).toBe(true);
  });

  it('sets errors if cspNonce is not a data element', () => {
    extensionBridge.init({
      settings: {
        cspNonce: 'foo'
      }
    });

    expect(extensionBridge.validate()).toBe(false);
    expect(
      pageElements.getCSPNonceTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
  });

  it('sets errors if cspNonce contains two data elements', () => {
    extensionBridge.init({
      settings: {
        cspNonce: '%foo%%bar%'
      }
    });

    expect(extensionBridge.validate()).toBe(false);
    expect(
      pageElements.getCSPNonceTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
  });

  it('removes cspNonce from the settings object if the value is falsy', () => {
    extensionBridge.init({
      settings: {
        cspNonce: '%foo%'
      }
    });

    userEvent.clear(pageElements.getCSPNonceTextBox());

    expect(extensionBridge.getSettings()).toEqual({});
    expect(extensionBridge.validate()).toBe(true);
  });
});
