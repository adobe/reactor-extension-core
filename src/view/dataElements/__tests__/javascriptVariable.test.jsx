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
import JavaScriptVariable, { formConfig } from '../javascriptVariable';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getPathTextBox: () => {
    return screen.getByRole('textbox', { name: /javascript variable name/i });
  }
};

describe('javascript variable data element view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(JavaScriptVariable, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        path: 'foo'
      }
    });

    expect(pageElements.getPathTextBox().value).toBe('foo');
  });

  it('sets settings from form values', () => {
    userEvent.type(pageElements.getPathTextBox(), 'foo');

    expect(extensionBridge.getSettings()).toEqual({
      path: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    fireEvent.focus(pageElements.getPathTextBox());
    fireEvent.blur(pageElements.getPathTextBox());

    expect(
      pageElements.getPathTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });
});
