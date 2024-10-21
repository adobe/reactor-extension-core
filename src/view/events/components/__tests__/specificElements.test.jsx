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
import SpecificElements, { formConfig } from '../specificElements';
import bootstrap from '../../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getPropertiesCheckbox: () => {
    return screen.getByRole('checkbox', {
      name: /and having certain property values/i
    });
  },
  getElementSelectorTextBox: () => {
    return screen.getByRole('textbox', { name: /selector/i });
  }
};

describe('specificElements', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(SpecificElements, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('updates view properly when elementProperties provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            name: 'a',
            value: 'b'
          },
          {
            name: 'b',
            value: 'c'
          }
        ]
      }
    });

    expect(pageElements.getPropertiesCheckbox().checked).toBeTrue();
    expect(screen.getByTestId('element-properties-editor')).toBeTruthy();

    expect(extensionBridge.validate()).toBe(true);
  });

  it('updates view properly when elementProperties not provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo'
      }
    });

    expect(pageElements.getElementSelectorTextBox().value).toBe('.foo');
    expect(pageElements.getPropertiesCheckbox().checked).toBeFalse();
    expect(screen.queryByTestId('element-properties-editor')).toBeFalsy();
  });

  it('removes elementProperties from settings if element properties hidden', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            name: 'a',
            value: 'b'
          }
        ]
      }
    });

    fireEvent.click(pageElements.getPropertiesCheckbox());

    expect(extensionBridge.getSettings().elementProperties).toBeUndefined();
  });

  it('sets error if elementSelector is not specified', async () => {
    fireEvent.focus(pageElements.getElementSelectorTextBox());
    fireEvent.blur(pageElements.getElementSelectorTextBox());
    expect(
      pageElements.getElementSelectorTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    expect(extensionBridge.validate()).toBe(false);
  });

  it('removes elementProperties error if element properties not shown', () => {
    // An element property with a value but not a name would typically create a validation error
    // if the element properties editor were visible.
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            value: 'b'
          }
        ]
      }
    });

    fireEvent.click(pageElements.getPropertiesCheckbox());

    expect(extensionBridge.validate()).toBe(true);
  });
});
