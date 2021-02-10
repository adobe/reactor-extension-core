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

import {
  fireEvent,
  render,
  screen,
  within,
  waitFor
} from '@testing-library/react';
import { sharedTestingElements } from '@test-helpers/react-testing-library';
import MediaTimePlayed, { formConfig } from '../mediaTimePlayed';
import bootstrap from '../../bootstrap';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';

// react-testing-library element selectors
const pageElements = {
  ...sharedTestingElements,
  triggerWhen: {
    getTextBox: () => {
      return screen.getByRole('textbox', { name: /amount/i });
    },
    getUnitsDropdown: () => {
      return screen.getByRole('button', { name: /units/i });
    },
    getDataElementModalTrigger: () => {
      return screen.getByRole('button', { name: /select a data element/i });
    }
  }
};

describe('time played event view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(MediaTimePlayed, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        amount: 55,
        unit: 'percent',
        bubbleStop: true
      }
    });

    expect(pageElements.elementsMatching.getCssSelectorTextBox().value).toBe(
      '.foo'
    );

    expect(pageElements.triggerWhen.getTextBox().value).toBe('55');
    within(pageElements.triggerWhen.getUnitsDropdown()).getByText('percent');

    fireEvent.click(pageElements.advancedSettings.getSettingsToggleTrigger());
    expect(pageElements.advancedSettings.getBubbleStopCheckBox().value).toBe(
      'true'
    );
  });

  it('sets settings from form values', async () => {
    fireEvent.change(pageElements.elementsMatching.getCssSelectorTextBox(), {
      target: { value: '.foo' }
    });

    fireEvent.change(pageElements.triggerWhen.getTextBox(), {
      target: { value: '45' }
    });

    fireEvent.click(pageElements.advancedSettings.getSettingsToggleTrigger());
    fireEvent.click(pageElements.advancedSettings.getBubbleStopCheckBox());

    const {
      amount,
      unit,
      elementSelector,
      bubbleStop
    } = extensionBridge.getSettings();
    expect(amount).toBe(45);
    expect(unit).toBe('second');
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);

    // try changing the select box
    fireEvent.click(pageElements.triggerWhen.getUnitsDropdown());
    await waitFor(() =>
      document.querySelector('div[role="presentation"][data-ismodal]')
    );
    screen.getByRole('option', { name: /percent/i }).click();

    expect(extensionBridge.getSettings().unit).toBe('percent');
  });

  it('sets validation errors', () => {
    fireEvent.focus(pageElements.elementsMatching.getCssSelectorTextBox());
    fireEvent.blur(pageElements.elementsMatching.getCssSelectorTextBox());
    expect(
      pageElements.elementsMatching
        .getCssSelectorTextBox()
        .hasAttribute('aria-invalid')
    ).toBeTrue();

    fireEvent.focus(pageElements.triggerWhen.getTextBox());
    fireEvent.blur(pageElements.triggerWhen.getTextBox());
    expect(
      pageElements.triggerWhen.getTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    expect(extensionBridge.validate()).toBe(false);
  });

  it('The media amount input supports opening the data element modal', () => {
    spyOn(extensionBridge, 'openDataElementSelector').and.callFake(() => {
      return Promise.resolve();
    });

    fireEvent.click(pageElements.triggerWhen.getDataElementModalTrigger());
    expect(extensionBridge.openDataElementSelector).toHaveBeenCalledTimes(1);
  });

  it('media amount handles data element names just fine', () => {
    fireEvent.focus(pageElements.triggerWhen.getTextBox());
    fireEvent.change(pageElements.triggerWhen.getTextBox(), {
      target: { value: '%Data Element 1%' }
    });
    fireEvent.blur(pageElements.triggerWhen.getTextBox());

    expect(
      pageElements.triggerWhen.getTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();
  });
});
