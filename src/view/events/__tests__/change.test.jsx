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
import Change, { formConfig } from '../change';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  valueField: {
    getShowFieldCheckBox: () => {
      return screen.getByRole('checkbox', {
        name: /and is changed to the following value/i
      });
    },
    getValueTextBox: () => {
      return screen.getByRole('textbox', { name: /value/i });
    },
    getDataElementModalTrigger: () => {
      return screen.getByRole('button', { name: /select a data element/i });
    },
    getRegexToggleSwitch: () => {
      return screen.getByRole('switch', { name: /regex/i });
    }
  }
};

describe('change event view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(Change, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        value: 'abc',
        valueIsRegex: true,
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    expect(pageElements.valueField.getShowFieldCheckBox().checked).toBeTrue();
    expect(pageElements.valueField.getValueTextBox().value).toBe('abc');
    expect(pageElements.valueField.getRegexToggleSwitch().checked).toBeTrue();
    expect(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox().value
    ).toBe('.foo');

    fireEvent.click(sharedTestingElements.advancedSettings.getToggleTrigger());
    expect(
      sharedTestingElements.advancedSettings.getBubbleStopCheckBox().checked
    ).toBeTrue();
  });

  it('sets settings from form values', async () => {
    fireEvent.click(pageElements.valueField.getShowFieldCheckBox());

    userEvent.type(pageElements.valueField.getValueTextBox(), 'abc');
    fireEvent.click(pageElements.valueField.getRegexToggleSwitch());
    userEvent.type(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox(),
      '.foo'
    );

    fireEvent.click(sharedTestingElements.advancedSettings.getToggleTrigger());
    fireEvent.click(
      sharedTestingElements.advancedSettings.getBubbleStopCheckBox()
    );

    const {
      value,
      valueIsRegex,
      elementSelector,
      bubbleStop
    } = extensionBridge.getSettings();

    expect(value).toBe('abc');
    expect(valueIsRegex).toBe(true);
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
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
    ).toBeTruthy();

    expect(extensionBridge.validate()).toBe(false);
  });

  it('The change input supports opening the data element modal', () => {
    spyOn(extensionBridge, 'openDataElementSelector').and.callFake(() => {
      return Promise.resolve();
    });

    fireEvent.click(pageElements.valueField.getShowFieldCheckBox());
    fireEvent.click(pageElements.valueField.getDataElementModalTrigger());
    expect(extensionBridge.openDataElementSelector).toHaveBeenCalledTimes(1);
  });

  it('change handles data element names just fine', () => {
    fireEvent.click(pageElements.valueField.getShowFieldCheckBox());

    fireEvent.focus(pageElements.valueField.getValueTextBox());
    userEvent.type(
      pageElements.valueField.getValueTextBox(),
      '%Data Element 1%'
    );
    fireEvent.blur(pageElements.valueField.getValueTextBox());

    expect(
      pageElements.valueField.getValueTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();

    expect(extensionBridge.getSettings().value).toBe('%Data Element 1%');
  });
});
