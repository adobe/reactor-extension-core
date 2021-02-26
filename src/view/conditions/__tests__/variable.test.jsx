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
import Variable, { formConfig } from '../variable';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getNameTextBox: () => {
    return screen.getByRole('textbox', { name: /name/i });
  },
  getValueTextBox: () => {
    return screen.getByRole('textbox', { name: /value/i });
  },
  getRegexToggleSwitch: () => {
    return screen.getByRole('switch', { name: /regex/i });
  }
};

describe('variable condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(Variable, formConfig, extensionBridge));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      }
    });

    expect(pageElements.getNameTextBox().value).toBe('foo');
    expect(pageElements.getValueTextBox().value).toBe('bar');
    expect(pageElements.getRegexToggleSwitch().checked).toBeTrue();
  });

  it('sets settings from form values', () => {
    userEvent.type(pageElements.getNameTextBox(), 'foo');
    userEvent.type(pageElements.getValueTextBox(), 'bar');
    fireEvent.click(pageElements.getRegexToggleSwitch());

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      value: 'bar',
      valueIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    fireEvent.focus(pageElements.getNameTextBox());
    fireEvent.blur(pageElements.getNameTextBox());
    expect(
      pageElements.getNameTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    fireEvent.focus(pageElements.getValueTextBox());
    fireEvent.blur(pageElements.getValueTextBox());
    expect(
      pageElements.getValueTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    expect(extensionBridge.validate()).toBe(false);
  });
});
