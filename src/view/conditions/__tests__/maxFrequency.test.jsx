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
import {
  clickSpectrumOption,
  safelyWaitForElementToBeRemoved
} from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import MaxFrequency, { formConfig } from '../maxFrequency';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getCountTextBox: () => screen.getByRole('textbox', { name: /count/i }),
  unitsDropdown: {
    getTrigger: () => {
      return screen.getByRole('button', { name: /unit/i });
    },
    waitForSessionOption: () => {
      return screen.findByRole('option', { name: /session/i });
    },
    waitForVisitorOption: () => {
      return screen.findByRole('option', { name: /visitor/i });
    }
  }
};

describe('max frequency condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(MaxFrequency, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values to defaults', () => {
    expect(
      within(pageElements.unitsDropdown.getTrigger()).findByText(/page view/i)
    ).toBeTruthy();
    expect(pageElements.getCountTextBox().value).toBe('1');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        count: 3,
        unit: 'session'
      }
    });

    expect(
      within(pageElements.unitsDropdown.getTrigger()).findByText(/session/i)
    ).toBeTruthy();
    expect(pageElements.getCountTextBox().value).toBe('3');
  });

  it('sets settings from form values', async () => {
    fireEvent.click(pageElements.unitsDropdown.getTrigger());
    const sessionOption = await pageElements.unitsDropdown.waitForSessionOption();
    clickSpectrumOption(sessionOption);
    await safelyWaitForElementToBeRemoved(() =>
      screen.queryByRole('option', { name: /session/i })
    );

    fireEvent.change(pageElements.getCountTextBox(), {
      target: { value: '3' }
    });

    expect(extensionBridge.getSettings()).toEqual({
      count: 3,
      unit: 'session'
    });
  });

  it('sets errors if count is not greater or equal to 1', () => {
    extensionBridge.init({
      settings: {
        count: 5,
        unit: 'session'
      }
    });

    fireEvent.focus(pageElements.getCountTextBox());
    fireEvent.change(pageElements.getCountTextBox(), {
      target: { value: '-1' }
    });
    fireEvent.blur(pageElements.getCountTextBox());

    expect(
      pageElements.getCountTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);

    fireEvent.focus(pageElements.getCountTextBox());
    fireEvent.change(pageElements.getCountTextBox(), {
      target: { value: '' }
    });
    fireEvent.blur(pageElements.getCountTextBox());

    expect(
      pageElements.getCountTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  describe('visitor unit', () => {
    it('sets form values from settings', () => {
      extensionBridge.init({
        settings: {
          unit: 'visitor'
        }
      });

      expect(screen.queryAllByRole('textbox', { name: /count/i }).length).toBe(
        0
      );

      expect(
        within(pageElements.unitsDropdown.getTrigger()).findByText(/visitor/i)
      ).toBeTruthy();
    });

    it('sets settings from form values', async () => {
      fireEvent.click(pageElements.unitsDropdown.getTrigger());
      const visitorOption = await pageElements.unitsDropdown.waitForVisitorOption();
      clickSpectrumOption(visitorOption);

      expect(extensionBridge.getSettings()).toEqual({
        unit: 'visitor'
      });
    });
  });
});
