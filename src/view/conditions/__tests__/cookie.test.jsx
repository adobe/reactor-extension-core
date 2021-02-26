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
import Cookie, { formConfig } from '../cookie';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getCookieNameTextBox: () => {
    return screen.getByRole('textbox', { name: /cookie name/i });
  },
  getCookieValueTextBox: () => {
    return screen.getByRole('textbox', { name: /cookie value/i });
  },
  regex: {
    getToggleSwitch: () => {
      return screen.getByRole('switch', { name: /regex/i });
    },
    getTestButton: () => {
      return screen.getByRole('button', { name: /test/i });
    }
  }
};

describe('cookie condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(Cookie, formConfig));
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

    expect(pageElements.getCookieNameTextBox().value).toBe('foo');
    expect(pageElements.getCookieValueTextBox().value).toBe('bar');
    expect(pageElements.regex.getToggleSwitch().checked).toBe(true);
  });

  it('sets settings from form values', () => {
    userEvent.type(pageElements.getCookieNameTextBox(), 'foo');
    userEvent.type(pageElements.getCookieValueTextBox(), 'bar');
    fireEvent.click(pageElements.regex.getToggleSwitch());

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      value: 'bar',
      valueIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    fireEvent.focus(pageElements.getCookieNameTextBox());
    fireEvent.blur(pageElements.getCookieNameTextBox());
    expect(
      pageElements.getCookieNameTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    fireEvent.focus(pageElements.getCookieValueTextBox());
    fireEvent.blur(pageElements.getCookieValueTextBox());
    expect(
      pageElements.getCookieValueTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    expect(extensionBridge.validate()).toBe(false);
  });

  it('the regex test button gives an example regex', () => {
    spyOn(extensionBridge, 'openRegexTester').and.callFake(() => ({
      then(resolve) {
        resolve('Edited Regex 1234');
      }
    }));

    userEvent.type(pageElements.getCookieValueTextBox(), 'initial value');
    fireEvent.click(pageElements.regex.getToggleSwitch());
    fireEvent.click(pageElements.regex.getTestButton());

    expect(pageElements.getCookieValueTextBox().value).not.toBe(
      'initial value'
    );
    expect(pageElements.getCookieValueTextBox().value).toBe(
      'Edited Regex 1234'
    );
  });
});
