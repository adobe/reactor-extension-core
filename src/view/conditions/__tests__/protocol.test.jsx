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
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import Protocol, { formConfig } from '../protocol';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  radioGroup: {
    getHttp: () => screen.getByRole('radio', { name: /http$/i }),
    getHttps: () => screen.getByRole('radio', { name: /^https/i })
  }
};

describe('protocol condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(Protocol, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets http radio as checked by default', () => {
    expect(pageElements.radioGroup.getHttp().checked).toBeTrue();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        protocol: 'https:'
      }
    });

    expect(pageElements.radioGroup.getHttps().checked).toBeTrue();
  });

  it('sets settings from form values', () => {
    fireEvent.click(pageElements.radioGroup.getHttps());

    expect(extensionBridge.getSettings()).toEqual({
      protocol: 'https:'
    });
  });
});
