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
import userEvent from '@testing-library/user-event';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import LandingPage, { formConfig } from '../landingPage';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getLandingPageTextBox: () => screen.getByRole('textbox', { name: /page/i }),
  regex: {
    getToggleSwitch: () => {
      return screen.getByRole('switch', { name: /regex/i });
    }
  }
};

describe('landing page condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(LandingPage, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        page: 'foo',
        pageIsRegex: true
      }
    });

    expect(pageElements.getLandingPageTextBox().value).toBe('foo');
    expect(pageElements.regex.getToggleSwitch().checked).toBeTrue();
  });

  it('sets settings from form values', () => {
    userEvent.type(pageElements.getLandingPageTextBox(), 'foo');
    fireEvent.click(pageElements.regex.getToggleSwitch());

    expect(extensionBridge.getSettings()).toEqual({
      page: 'foo',
      pageIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    fireEvent.focus(pageElements.getLandingPageTextBox());
    fireEvent.blur(pageElements.getLandingPageTextBox());
    expect(
      pageElements.getLandingPageTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });
});
