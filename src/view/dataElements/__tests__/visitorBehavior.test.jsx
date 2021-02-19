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
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import VisitorBehavior, { formConfig } from '../visitorBehavior';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getDropdownTrigger: () => {
    return screen.getByRole('button', { name: /attribute/i });
  },
  waitForMinutesOnSiteOption: () => {
    return screen.findByRole('option', { name: /minutes on site/i });
  }
};

describe('visitor behavior data element view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(VisitorBehavior, formConfig, extensionBridge));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        attribute: 'minutesOnSite'
      }
    });

    expect(
      within(pageElements.getDropdownTrigger()).getByText(/minutes on site/i)
    ).toBeTruthy();
  });

  it('sets form value defaults', () => {
    expect(
      within(pageElements.getDropdownTrigger()).getByText(/landing page/i)
    ).toBeTruthy();
  });

  it('sets settings from form values', async () => {
    fireEvent.click(pageElements.getDropdownTrigger());

    const minutesOnSiteOption = await pageElements.waitForMinutesOnSiteOption();
    minutesOnSiteOption.click();

    expect(extensionBridge.getSettings()).toEqual({
      attribute: 'minutesOnSite'
    });
  });
});
