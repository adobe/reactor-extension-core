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
import TimeOnPage, { formConfig } from '../timeOnPage';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  timeOnPage: {
    getTextBox: () => screen.getByRole('textbox', { name: /time on page/i }),
    getDataElementModalTrigger: () => {
      return screen.getByRole('button', { name: /select a data element/i });
    }
  }
};

describe('time on page event view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(TimeOnPage, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        timeOnPage: 44
      }
    });

    expect(pageElements.timeOnPage.getTextBox().value).toBe('44');
  });

  it('sets settings from form values', () => {
    fireEvent.focus(pageElements.timeOnPage.getTextBox());
    userEvent.type(pageElements.timeOnPage.getTextBox(), '55');
    fireEvent.blur(pageElements.timeOnPage.getTextBox());
    expect(
      pageElements.timeOnPage.getTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();

    expect(extensionBridge.getSettings()).toEqual({
      timeOnPage: 55
    });
  });

  it('sets errors if required values are not provided', () => {
    fireEvent.focus(pageElements.timeOnPage.getTextBox());
    fireEvent.blur(pageElements.timeOnPage.getTextBox());
    expect(
      pageElements.timeOnPage.getTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
  });

  it('sets error if timeOnPage value is not a number', () => {
    fireEvent.focus(pageElements.timeOnPage.getTextBox());
    userEvent.type(pageElements.timeOnPage.getTextBox(), '12.abc');
    fireEvent.blur(pageElements.timeOnPage.getTextBox());
    expect(
      pageElements.timeOnPage.getTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    expect(extensionBridge.validate()).toBe(false);
  });

  it('sets validation error when the number < 1', () => {
    expect(
      pageElements.timeOnPage.getTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();

    fireEvent.focus(pageElements.timeOnPage.getTextBox());
    userEvent.type(pageElements.timeOnPage.getTextBox(), '0');
    fireEvent.blur(pageElements.timeOnPage.getTextBox());

    expect(
      pageElements.timeOnPage.getTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
  });

  it('The timeOnPage input supports opening the data element modal', () => {
    spyOn(extensionBridge, 'openDataElementSelector').and.callFake(() => {
      return Promise.resolve();
    });

    fireEvent.click(pageElements.timeOnPage.getDataElementModalTrigger());
    expect(extensionBridge.openDataElementSelector).toHaveBeenCalledTimes(1);
  });

  it('timeOnPage handles data element names just fine', () => {
    fireEvent.focus(pageElements.timeOnPage.getTextBox());
    userEvent.type(pageElements.timeOnPage.getTextBox(), '%Data Element 1%');
    fireEvent.blur(pageElements.timeOnPage.getTextBox());

    expect(
      pageElements.timeOnPage.getTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();

    expect(extensionBridge.getSettings().timeOnPage).toBe('%Data Element 1%');
  });
});
