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
import { changePickerValue } from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import DomAttribute, { formConfig } from '../domAttribute';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getElementPropertyPresetsDropdown: () => {
    return screen.getByRole('button', { name: /use the value of/i });
  },
  getElementSelectorTextBox: () => {
    return screen.getByRole('textbox', { name: /element selector/i });
  },
  getCustomElementPropertyTextBox: () => {
    return screen.getByRole('textbox', { name: /custom element property/i });
  },
  queryForCustomElementPropertyTextBox: () => {
    return screen.queryByRole('textbox', { name: /custom element property/i });
  }
};

describe('DOM attribute data element view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(DomAttribute, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('selects ID preset for new settings', () => {
    expect(
      within(pageElements.getElementPropertyPresetsDropdown()).getByText(/id/i)
    ).toBeTruthy();
  });

  it('sets form values from settings using element property preset', () => {
    extensionBridge.init({
      settings: {
        elementSelector: 'foo',
        elementProperty: 'innerHTML'
      }
    });

    expect(pageElements.getElementSelectorTextBox().value).toBe('foo');
    expect(
      within(pageElements.getElementPropertyPresetsDropdown()).getByText(
        /other attribute/i
      )
    ).toBeTruthy();
    expect(pageElements.getCustomElementPropertyTextBox().value).toBe(
      'innerHTML'
    );
  });

  it('sets form values from settings using custom element property', () => {
    extensionBridge.init({
      settings: {
        elementSelector: 'foo',
        elementProperty: 'bar'
      }
    });

    expect(pageElements.getElementSelectorTextBox().value).toBe('foo');
    expect(
      within(pageElements.getElementPropertyPresetsDropdown()).getByText(
        /other attribute/i
      )
    ).toBeTruthy();
    expect(pageElements.getCustomElementPropertyTextBox().value).toBe('bar');
  });

  it('sets error if element selector not provided', () => {
    fireEvent.focus(pageElements.getElementSelectorTextBox());
    fireEvent.blur(pageElements.getElementSelectorTextBox());

    expect(
      pageElements.getElementSelectorTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('sets settings from form values using element property preset', async () => {
    userEvent.type(pageElements.getElementSelectorTextBox(), 'foo');
    await changePickerValue(
      pageElements.getElementPropertyPresetsDropdown(),
      /html/i
    );

    expect(extensionBridge.getSettings()).toEqual({
      elementSelector: 'foo',
      elementProperty: 'innerHTML'
    });
  });

  it('sets settings from form values using custom element property', async () => {
    userEvent.type(pageElements.getElementSelectorTextBox(), 'foo');
    await changePickerValue(
      pageElements.getElementPropertyPresetsDropdown(),
      /other attribute/i
    );
    userEvent.type(pageElements.getCustomElementPropertyTextBox(), 'bar');

    expect(extensionBridge.getSettings()).toEqual({
      elementSelector: 'foo',
      elementProperty: 'bar'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: 'foo',
        elementProperty: ''
      }
    });

    expect(extensionBridge.validate()).toBe(false);
    expect(
      pageElements
        .getCustomElementPropertyTextBox()
        .hasAttribute('aria-invalid')
    ).toBeTruthy();
  });
});
