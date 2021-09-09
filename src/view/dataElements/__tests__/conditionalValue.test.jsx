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
import { fillInTextBox } from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import ConditionalValue, { formConfig } from '../conditionalValue';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getConditionalValueTextBox: () =>
    screen.getByRole('textbox', { name: /if true, return this string value/i }),
  getFallbackValueTextBox: () =>
    screen.getByRole('textbox', {
      name: /otherwise, return this string value/i
    })
};

describe('conditional value data element view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(ConditionalValue, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        leftOperand: '%Data Element 1%',
        comparison: {
          operator: 'equals'
        },
        rightOperand: 1,
        conditionalValue: 'a',
        fallbackValue: 'b'
      }
    });

    expect(pageElements.getConditionalValueTextBox().value).toBe('a');
    expect(pageElements.getFallbackValueTextBox().value).toBe('b');
  });

  it('sets settings from form values', () => {
    fillInTextBox(pageElements.getConditionalValueTextBox(), 'a');
    fillInTextBox(pageElements.getFallbackValueTextBox(), 'b');

    expect(extensionBridge.getSettings()).toEqual({
      leftOperand: '',
      comparison: {
        operator: 'equals'
      },
      rightOperand: '',
      conditionalValue: 'a',
      fallbackValue: 'b'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init({
      settings: {
        leftOperand: '%Data Element 1%',
        comparison: {
          operator: 'equals'
        },
        rightOperand: '',
        conditionalValue: '',
        fallbackValue: ''
      }
    });

    const conditionalValueTextBox = pageElements.getConditionalValueTextBox();
    fireEvent.focus(conditionalValueTextBox);
    fireEvent.blur(conditionalValueTextBox);

    expect(
      pageElements.getConditionalValueTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    expect(extensionBridge.validate()).toBe(false);
  });
});
