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
import { sharedTestingElements } from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import Hover, { formConfig } from '../hover';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  delayHover: {
    radioGroup: {
      getImmediately: () => screen.getByRole('radio', { name: /immediately/i }),
      getAfterDelay: () => screen.getByRole('radio', { name: /after a delay/i })
    },
    getDelayTextBox: () => screen.getByRole('textbox', { name: /delay/i }),
    getDataElementModalTrigger: () => {
      return screen.getByRole('button', { name: /select a data element/i });
    }
  }
};

describe('hover event view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(Hover, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('the default hover options are chosen', () => {
    expect(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox().value
    ).toBe('');

    expect(
      pageElements.delayHover.radioGroup.getImmediately().checked
    ).toBeTrue();
    expect(
      pageElements.delayHover.radioGroup.getAfterDelay().checked
    ).toBeFalse();

    fireEvent.click(sharedTestingElements.advancedSettings.getToggleTrigger());
    expect(
      sharedTestingElements.advancedSettings.getBubbleFireIfParentCheckbox()
        .value
    ).toBe('true');
    expect(
      sharedTestingElements.advancedSettings.getBubbleFireIfChildFiredCheckbox()
        .value
    ).toBe('true');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        delay: 100,
        bubbleStop: true
      }
    });

    expect(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox().value
    ).toBe('.foo');

    fireEvent.click(pageElements.delayHover.radioGroup.getAfterDelay());
    expect(pageElements.delayHover.getDelayTextBox().value).toBe('100');

    fireEvent.click(sharedTestingElements.advancedSettings.getToggleTrigger());
    expect(
      sharedTestingElements.advancedSettings.getBubbleStopCheckBox().value
    ).toBe('true');
  });

  it('sets settings from form values', () => {
    fireEvent.change(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox(),
      {
        target: { value: '.foo' }
      }
    );

    fireEvent.click(pageElements.delayHover.radioGroup.getAfterDelay());
    fireEvent.change(pageElements.delayHover.getDelayTextBox(), {
      target: { value: '100' }
    });

    fireEvent.click(sharedTestingElements.advancedSettings.getToggleTrigger());
    fireEvent.click(
      sharedTestingElements.advancedSettings.getBubbleStopCheckBox()
    );

    const {
      elementSelector,
      delay,
      bubbleStop
    } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
    expect(delay).toBe(100);
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors for empty fields', () => {
    expect(
      sharedTestingElements.elementsMatching
        .getCssSelectorTextBox()
        .getAttribute('aria-invalid')
    ).toBeFalsy();
    fireEvent.focus(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox()
    );
    fireEvent.blur(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox()
    );
    expect(
      sharedTestingElements.elementsMatching
        .getCssSelectorTextBox()
        .getAttribute('aria-invalid')
    ).toBeTruthy();

    fireEvent.click(pageElements.delayHover.radioGroup.getAfterDelay());
    expect(
      pageElements.delayHover.getDelayTextBox().getAttribute('aria-invalid')
    ).toBeFalsy();
    fireEvent.focus(pageElements.delayHover.getDelayTextBox());
    fireEvent.blur(pageElements.delayHover.getDelayTextBox());
    expect(
      pageElements.delayHover.getDelayTextBox().getAttribute('aria-invalid')
    ).toBeTruthy();
  });

  it('sets validation error when the number < 1', () => {
    fireEvent.click(pageElements.delayHover.radioGroup.getAfterDelay());

    fireEvent.focus(pageElements.delayHover.getDelayTextBox());
    fireEvent.change(pageElements.delayHover.getDelayTextBox(), {
      target: { value: '0' }
    });
    fireEvent.blur(pageElements.delayHover.getDelayTextBox());

    expect(
      pageElements.delayHover.getDelayTextBox().getAttribute('aria-invalid')
    ).toBeTruthy();
  });

  it('The afterDelay input supports opening the data element modal', () => {
    spyOn(extensionBridge, 'openDataElementSelector').and.callFake(() => {
      return Promise.resolve();
    });

    fireEvent.click(pageElements.delayHover.radioGroup.getAfterDelay());
    fireEvent.click(pageElements.delayHover.getDataElementModalTrigger());
    expect(extensionBridge.openDataElementSelector).toHaveBeenCalledTimes(1);
  });

  it('afterDelay handles data element names just fine', () => {
    fireEvent.click(pageElements.delayHover.radioGroup.getAfterDelay());

    fireEvent.focus(pageElements.delayHover.getDelayTextBox());
    fireEvent.change(pageElements.delayHover.getDelayTextBox(), {
      target: { value: '%Data Element 1%' }
    });
    fireEvent.blur(pageElements.delayHover.getDelayTextBox());

    expect(
      pageElements.delayHover.getDelayTextBox().getAttribute('aria-invalid')
    ).toBeFalsy();
  });
});
