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
import EntersViewport, { formConfig } from '../entersViewport';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  delayWhenEnters: {
    radioGroup: {
      getImmediately: () => screen.getByRole('radio', { name: /immediately/i }),
      getAfterDelay: () => screen.getByRole('radio', { name: /after a delay/i })
    },
    getDelayTextBox: () => screen.getByRole('textbox', { name: /delay/i }),
    getDataElementModalTrigger: () => {
      return screen.getByRole('button', { name: /select a data element/i });
    }
  },
  frequency: {
    radioGroup: {
      getFirstTime: () => {
        return screen.getByRole('radio', {
          name: /first time element enters viewport/i
        });
      },
      getEveryTime: () => {
        return screen.getByRole('radio', {
          name: /every time element enters viewport/i
        });
      }
    }
  }
};

describe('enters viewport event view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(EntersViewport, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        delay: '100',
        frequency: 'everyEntry'
      }
    });
    expect(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox().value
    ).toBe('.foo');

    fireEvent.click(pageElements.delayWhenEnters.radioGroup.getAfterDelay());
    expect(pageElements.delayWhenEnters.getDelayTextBox().value).toBe('100');

    expect(
      pageElements.frequency.radioGroup.getFirstTime().checked
    ).toBeFalse();
    expect(pageElements.frequency.radioGroup.getEveryTime().checked).toBeTrue();
  });

  it('sets settings from form values', () => {
    fireEvent.focus(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox()
    );
    fireEvent.change(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox(),
      {
        target: { value: '.foo' }
      }
    );
    fireEvent.blur(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox()
    );
    expect(
      sharedTestingElements.elementsMatching
        .getCssSelectorTextBox()
        .hasAttribute('aria-invalid')
    ).toBeFalse();

    fireEvent.click(pageElements.delayWhenEnters.radioGroup.getAfterDelay());
    fireEvent.focus(pageElements.delayWhenEnters.getDelayTextBox());
    fireEvent.change(pageElements.delayWhenEnters.getDelayTextBox(), {
      target: { value: '100' }
    });
    fireEvent.blur(pageElements.delayWhenEnters.getDelayTextBox());
    expect(
      pageElements.delayWhenEnters
        .getDelayTextBox()
        .hasAttribute('aria-invalid')
    ).toBeFalse();

    fireEvent.click(pageElements.frequency.radioGroup.getEveryTime());

    const { elementSelector, delay, frequency } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
    expect(delay).toBe(100);
    expect(frequency).toBe('everyEntry');
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
    ).toBeTrue();

    fireEvent.click(pageElements.delayWhenEnters.radioGroup.getAfterDelay());
    fireEvent.focus(pageElements.delayWhenEnters.getDelayTextBox());
    fireEvent.blur(pageElements.delayWhenEnters.getDelayTextBox());

    expect(
      pageElements.delayWhenEnters
        .getDelayTextBox()
        .hasAttribute('aria-invalid')
    ).toBeTrue();
  });

  it('sets validation error when the number < 1', () => {
    fireEvent.click(pageElements.delayWhenEnters.radioGroup.getAfterDelay());

    fireEvent.focus(pageElements.delayWhenEnters.getDelayTextBox());
    fireEvent.change(pageElements.delayWhenEnters.getDelayTextBox(), {
      target: { value: '0' }
    });
    fireEvent.blur(pageElements.delayWhenEnters.getDelayTextBox());
    expect(
      pageElements.delayWhenEnters
        .getDelayTextBox()
        .hasAttribute('aria-invalid')
    ).toBeTrue();
  });

  it('The delayWhenEnters input supports opening the data element modal', () => {
    spyOn(extensionBridge, 'openDataElementSelector').and.callFake(() => {
      return Promise.resolve();
    });

    fireEvent.click(pageElements.delayWhenEnters.radioGroup.getAfterDelay());
    fireEvent.click(pageElements.delayWhenEnters.getDataElementModalTrigger());
    expect(extensionBridge.openDataElementSelector).toHaveBeenCalledTimes(1);
  });

  it('delayWhenEnters handles data element names just fine', () => {
    fireEvent.click(pageElements.delayWhenEnters.radioGroup.getAfterDelay());

    fireEvent.focus(pageElements.delayWhenEnters.getDelayTextBox());
    fireEvent.change(pageElements.delayWhenEnters.getDelayTextBox(), {
      target: { value: '%Data Element 1%' }
    });
    fireEvent.blur(pageElements.delayWhenEnters.getDelayTextBox());

    expect(
      pageElements.delayWhenEnters
        .getDelayTextBox()
        .hasAttribute('aria-invalid')
    ).toBeFalse();
  });
});
