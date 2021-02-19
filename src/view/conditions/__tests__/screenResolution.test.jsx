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

import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import ScreenResolution, { formConfig } from '../screenResolution';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getWidthTextBox: () => {
    return screen.getByRole('textbox', { name: /width/i });
  },
  getWidthDropDownTrigger: () => {
    const [button] = screen.getAllByRole('button', {
      name: /operator/i
    });
    return button;
  },
  getHeightTextBox: () => {
    return screen.getByRole('textbox', { name: /height/i });
  },
  getHeightDropDownTrigger: () => {
    const [button] = screen
      .getAllByRole('button', {
        name: /operator/i
      })
      .slice(-1);
    return button;
  },
  waitForLessThanOption: () => {
    return screen.findByRole('option', { name: /less than$/i });
  },
  waitForEqualToOption: () => {
    return screen.findByRole('option', { name: /equal to/i });
  }
};

describe('screen resolution condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(ScreenResolution, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets operators to greater than by default', () => {
    expect(
      within(pageElements.getWidthDropDownTrigger()).getByText(/greater than/i)
    ).toBeTruthy();
    expect(
      within(pageElements.getHeightDropDownTrigger()).getByText(/greater than/i)
    ).toBeTruthy();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        widthOperator: '=',
        width: 100,
        heightOperator: '<',
        height: 200
      }
    });

    expect(
      within(pageElements.getWidthDropDownTrigger()).getByText(/equal to/i)
    ).toBeTruthy();
    expect(pageElements.getWidthTextBox().value).toBe('100');

    expect(
      within(pageElements.getHeightDropDownTrigger()).getByText(/less than/i)
    ).toBeTruthy();
    expect(pageElements.getHeightTextBox().value).toBe('200');
  });

  it('sets settings from form values', async () => {
    fireEvent.click(pageElements.getWidthDropDownTrigger());
    const equalToOption = await pageElements.waitForEqualToOption();
    equalToOption.click();
    await waitForElementToBeRemoved(equalToOption);

    fireEvent.click(pageElements.getHeightDropDownTrigger());
    const lessThanOption = await pageElements.waitForLessThanOption();
    lessThanOption.click();
    await waitForElementToBeRemoved(lessThanOption);

    userEvent.type(pageElements.getWidthTextBox(), '100');
    userEvent.type(pageElements.getHeightTextBox(), '200');

    expect(extensionBridge.getSettings()).toEqual({
      widthOperator: '=',
      width: 100,
      heightOperator: '<',
      height: 200
    });
  });

  it('sets errors if required values are not provided', () => {
    expect(extensionBridge.validate()).toBe(false);

    expect(
      pageElements.getWidthTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(
      pageElements.getHeightTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
  });

  it('sets errors if values are not numbers', () => {
    userEvent.type(pageElements.getWidthTextBox(), '12.abc');
    userEvent.type(pageElements.getHeightTextBox(), '12.abc');

    expect(extensionBridge.validate()).toBe(false);

    expect(
      pageElements.getWidthTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(
      pageElements.getHeightTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
  });
});
