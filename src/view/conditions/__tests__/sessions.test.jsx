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

import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clickSpectrumOption } from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import Sessions, { formConfig } from '../sessions';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getCountTextBox: () => screen.getByRole('textbox', { name: /count/i }),
  getOperatorDropdownTrigger: () => {
    return screen.getByRole('button', { name: /operator/i });
  },
  waitForEqualToOption: () => {
    return screen.findByRole('option', { name: /equal to/i });
  }
};

describe('sessions condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(Sessions, formConfig, extensionBridge));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets operator to greater than by default', () => {
    expect(
      within(pageElements.getOperatorDropdownTrigger()).getByText(
        /greater than/i
      )
    ).toBeTruthy();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operator: '=',
        count: 100
      }
    });

    expect(pageElements.getCountTextBox().value).toBe('100');
    expect(
      within(pageElements.getOperatorDropdownTrigger()).getByText(/equal to/i)
    ).toBeTruthy();
  });

  it('sets settings from form values', async () => {
    userEvent.type(pageElements.getCountTextBox(), '100');

    fireEvent.click(pageElements.getOperatorDropdownTrigger());
    const equalOption = await pageElements.waitForEqualToOption();
    clickSpectrumOption(equalOption);

    expect(extensionBridge.getSettings()).toEqual({
      operator: '=',
      count: 100
    });
  });

  it('sets errors if required values are not provided', () => {
    fireEvent.focus(pageElements.getCountTextBox());
    fireEvent.blur(pageElements.getCountTextBox());
    expect(
      pageElements.getCountTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    expect(extensionBridge.validate()).toBe(false);
  });

  it('sets error if count value is not a number', () => {
    fireEvent.focus(pageElements.getCountTextBox());
    userEvent.type(pageElements.getCountTextBox(), '12.abc');
    fireEvent.blur(pageElements.getCountTextBox());
    expect(
      pageElements.getCountTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    expect(extensionBridge.validate()).toBe(false);
  });
});
