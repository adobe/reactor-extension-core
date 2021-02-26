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
import userEvent from '@testing-library/user-event';
import TrafficSource, { formConfig } from '../trafficSource';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getSourceTextBox: () => screen.getByRole('textbox', { name: /source/i }),
  regex: {
    getToggleSwitch: () => {
      return screen.getByRole('switch', { name: /regex/i });
    }
  }
};

describe('traffic source condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(TrafficSource, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        source: 'foo',
        sourceIsRegex: true
      }
    });

    expect(pageElements.getSourceTextBox().value).toBe('foo');
    expect(pageElements.regex.getToggleSwitch().checked).toBeTrue();
  });

  it('sets settings from form values', () => {
    userEvent.type(pageElements.getSourceTextBox(), 'foo');
    fireEvent.click(pageElements.regex.getToggleSwitch());

    expect(extensionBridge.getSettings()).toEqual({
      source: 'foo',
      sourceIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    fireEvent.focus(pageElements.getSourceTextBox());
    fireEvent.blur(pageElements.getSourceTextBox());
    expect(
      pageElements.getSourceTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });
});
