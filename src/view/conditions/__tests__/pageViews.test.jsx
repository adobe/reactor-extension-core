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
import PageViews, { formConfig } from '../pageViews';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  operatorDropdown: {
    getTrigger: () => screen.getByRole('button', { name: /operator/i }),
    waitForEqualToOption: () => {
      return screen.findByRole('option', { name: /equal to/i });
    }
  },
  getCountTextBox: () => screen.getByRole('textbox', { name: /count/i }),
  duration: {
    radioGroup: {
      getLifeTime: () => screen.getByRole('radio', { name: /lifetime/i }),
      getCurrentSession: () => {
        return screen.getByRole('radio', { name: /current session/i });
      }
    }
  }
};

describe('page views condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(PageViews, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets operator to greater than by default', async () => {
    expect(
      within(pageElements.operatorDropdown.getTrigger()).getByText(
        /greater than/i
      )
    ).toBeTruthy();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operator: '=',
        count: 100,
        duration: 'session'
      }
    });

    expect(
      within(pageElements.operatorDropdown.getTrigger()).getByText(/equal to/i)
    ).toBeTruthy();
    expect(pageElements.getCountTextBox().value).toBe('100');
    expect(
      pageElements.duration.radioGroup.getCurrentSession().checked
    ).toBeTruthy();
  });

  it('sets settings from form values', async () => {
    fireEvent.click(pageElements.operatorDropdown.getTrigger());
    const equalTo = await pageElements.operatorDropdown.waitForEqualToOption();
    clickSpectrumOption(equalTo);
    await safelyWaitForElementToBeRemoved(() =>
      screen.queryByRole('option', { name: /equal to/i })
    );
    userEvent.type(pageElements.getCountTextBox(), '100');

    fireEvent.click(pageElements.duration.radioGroup.getCurrentSession());

    expect(extensionBridge.getSettings()).toEqual({
      operator: '=',
      count: 100,
      duration: 'session'
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
    userEvent.type(pageElements.getCountTextBox(), '12.abc');
    fireEvent.blur(pageElements.getCountTextBox());

    expect(
      pageElements.getCountTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });
});
