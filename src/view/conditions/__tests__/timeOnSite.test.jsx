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
import {
  clickSpectrumOption,
  safelyWaitForElementToBeRemoved
} from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import TimeOnSite, { formConfig } from '../timeOnSite';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getMinutesTextBox: () => {
    return screen.getByRole('textbox', { name: /minutes/i });
  },
  getDropdownTrigger: () => {
    return screen.getByRole('button', { name: /operator/i });
  },
  waitForEqualToOption: () => {
    return screen.findByRole('option', { name: /equal to/i });
  },
  getDataElementModalTrigger: () => {
    return screen.getByRole('button', { name: /select a data element/i });
  }
};

describe('time on site condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(TimeOnSite, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets operator to greater than by default', () => {
    expect(
      within(pageElements.getDropdownTrigger()).getByText(/greater than/i)
    ).toBeTruthy();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operator: '=',
        minutes: 100
      }
    });

    expect(
      within(pageElements.getDropdownTrigger()).getByText(/equal to/i)
    ).toBeTruthy();
    expect(pageElements.getMinutesTextBox().value).toBe('100');
  });

  it('sets settings from form values', async () => {
    fireEvent.click(pageElements.getDropdownTrigger());
    const equalOption = await pageElements.waitForEqualToOption();
    clickSpectrumOption(equalOption);
    await safelyWaitForElementToBeRemoved(() =>
      screen.queryByRole('option', { name: /equal to/i })
    );

    userEvent.type(pageElements.getMinutesTextBox(), '100');

    expect(extensionBridge.getSettings()).toEqual({
      operator: '=',
      minutes: 100
    });
  });

  it('sets errors if required values are not provided', () => {
    fireEvent.focus(pageElements.getMinutesTextBox());
    fireEvent.blur(pageElements.getMinutesTextBox());

    expect(
      pageElements.getMinutesTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('sets error if count value is not a number', () => {
    fireEvent.focus(pageElements.getMinutesTextBox());
    userEvent.type(pageElements.getMinutesTextBox(), '12.abc');
    fireEvent.blur(pageElements.getMinutesTextBox());

    expect(
      pageElements.getMinutesTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('sets validation error when the number < 1', async () => {
    fireEvent.focus(pageElements.getMinutesTextBox());
    userEvent.type(pageElements.getMinutesTextBox(), '-1');
    fireEvent.blur(pageElements.getMinutesTextBox());

    expect(
      pageElements.getMinutesTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
  });

  it('The timeOnSite input supports opening the data element modal', () => {
    spyOn(extensionBridge, 'openDataElementSelector').and.callFake(() => {
      return Promise.resolve();
    });

    fireEvent.click(pageElements.getDataElementModalTrigger());
    expect(extensionBridge.openDataElementSelector).toHaveBeenCalledTimes(1);
  });

  it('timeOnSite handles data element names just fine', () => {
    fireEvent.focus(pageElements.getMinutesTextBox());
    userEvent.type(pageElements.getMinutesTextBox(), '%Data Element 1%');
    fireEvent.blur(pageElements.getMinutesTextBox());

    expect(
      pageElements.getMinutesTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();
  });
});
