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
import ElementFilter, { formConfig } from '../elementFilter';
import bootstrap from '../../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  radioGroup: {
    getSpecificElements: () =>
      screen.getByRole('radio', { name: /specific elements/i }),
    getAnyElement: () => screen.getByRole('radio', { name: /any element/i })
  }
};

describe('elementFilter', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(ElementFilter, formConfig, extensionBridge));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('updates view properly when elementSelector is provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo'
      }
    });

    expect(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox().value
    ).toBe('.foo');
    expect(pageElements.radioGroup.getSpecificElements().checked).toBeTrue();
  });

  it('updates view properly when elementSelector is not provided', () => {
    extensionBridge.init({ settings: {} });

    expect(pageElements.radioGroup.getAnyElement().checked).toBeTrue();
    expect(
      sharedTestingElements.elementsMatching.queryForCssSelectorTextBox()
    ).toBeNull();
  });

  it(
    'removes elementSelector and elementProperties from settings if any ' +
      'element radio is selected',
    () => {
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

      fireEvent.click(pageElements.radioGroup.getAnyElement());

      const {
        elementSelector,
        elementProperties
      } = extensionBridge.getSettings();

      expect(elementSelector).toBeUndefined();
      expect(elementProperties).toBeUndefined();
    }
  );

  it('includes specificElements errors if specific element radio is selected', () => {
    fireEvent.click(pageElements.radioGroup.getSpecificElements());

    expect(extensionBridge.validate()).toBe(false);
    expect(
      sharedTestingElements.elementsMatching
        .getCssSelectorTextBox()
        .hasAttribute('aria-invalid')
    ).toBeTrue();
  });

  it('excludes specificElements errors if any element radio is selected', () => {
    extensionBridge.init();

    fireEvent.click(pageElements.radioGroup.getAnyElement());
    expect(extensionBridge.validate()).toBe(true);
  });
});
