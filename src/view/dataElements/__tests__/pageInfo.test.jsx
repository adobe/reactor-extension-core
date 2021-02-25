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

import { render, screen, within, fireEvent } from '@testing-library/react';
import { clickSpectrumOption } from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import PageInfo, { formConfig } from '../pageInfo';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getDropdownTrigger: () => {
    return screen.getByRole('button', { name: /attribute/i });
  },
  waitForProtocolOption: () => {
    return screen.findByRole('option', { name: /protocol/i });
  }
};

describe('page info data element view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(PageInfo, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        attribute: 'protocol'
      }
    });

    expect(
      within(pageElements.getDropdownTrigger()).getByText(/protocol/i)
    ).toBeTruthy();
  });

  it('sets form value defaults', () => {
    expect(
      within(pageElements.getDropdownTrigger()).getByText(/url/i)
    ).toBeTruthy();
  });

  it('sets settings from form values', async () => {
    fireEvent.click(pageElements.getDropdownTrigger());
    const protocolOption = await pageElements.waitForProtocolOption();
    clickSpectrumOption(protocolOption);

    expect(extensionBridge.getSettings()).toEqual({
      attribute: 'protocol'
    });
  });
});
