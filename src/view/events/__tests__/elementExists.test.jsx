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

import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { sharedTestingElements } from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import ElementExists, { formConfig } from '../elementExists';
import bootstrap from '../../bootstrap';

describe('element exists event view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(ElementExists, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo'
      }
    });

    expect(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox().value
    ).toBe('.foo');
  });

  it('sets settings from form values', () => {
    userEvent.type(
      sharedTestingElements.elementsMatching.getCssSelectorTextBox(),
      '.foo'
    );

    const { elementSelector } = extensionBridge.getSettings();
    expect(elementSelector).toBe('.foo');
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
    expect(extensionBridge.validate()).toBe(false);
  });
});
