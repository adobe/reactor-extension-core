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
import { sharedTestingElements } from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import CustomEvent, { formConfig } from '../customEvent';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getEventTypeTextBox: () =>
    screen.getByRole('textbox', { name: /custom event type/i })
};

describe('custom event event view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(CustomEvent, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        type: 'bar',
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    expect(pageElements.getEventTypeTextBox().value).toBe('bar');
    expect(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox().value
    ).toBe('.foo');

    fireEvent.click(sharedTestingElements.advancedSettings.getToggleTrigger());
    expect(
      sharedTestingElements.advancedSettings.getBubbleStopCheckBox().checked
    ).toBeTrue();
  });

  it('sets settings from form values', () => {
    userEvent.type(pageElements.getEventTypeTextBox(), 'bar');
    userEvent.type(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox(),
      '.foo'
    );

    fireEvent.click(sharedTestingElements.advancedSettings.getToggleTrigger());
    fireEvent.click(
      sharedTestingElements.advancedSettings.getBubbleStopCheckBox()
    );

    expect(extensionBridge.getSettings()).toEqual({
      elementSelector: '.foo',
      type: 'bar',
      bubbleStop: true,
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true
    });
  });

  it('sets errors if required values are not provided', () => {
    fireEvent.focus(pageElements.getEventTypeTextBox());
    fireEvent.blur(pageElements.getEventTypeTextBox());
    expect(
      pageElements.getEventTypeTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    fireEvent.focus(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox()
    );
    fireEvent.blur(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox()
    );
    expect(
      sharedTestingElements.elementsMatching
        .getCssSelectorTextBox()
        .hasAttribute('aria-invalid')
    ).toBeTrue();

    expect(extensionBridge.validate()).toBe(false);
  });
});
