/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { fireEvent, render, screen } from '@testing-library/react';
import { fillInTextBox } from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import ConditionalValue, { formConfig } from '../conditionalValue';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getConditionalValueTextBox: () =>
    screen.getByRole('textbox', { name: /if true, return this string value/i }),
  getReturnConditionalValueCheckbox: () => {
    return screen.getByRole('checkbox', {
      name: /return conditional value/i
    });
  },
  getFallbackValueTextBox: () =>
    screen.getByRole('textbox', {
      name: /otherwise, return this string value/i
    }),
  getReturnFallbackValueCheckbox: () => {
    return screen.getByRole('checkbox', {
      name: /return fallback value/i
    });
  }
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

  it('has the return conditional value checkbox checked by default', () => {
    expect(pageElements.getReturnConditionalValueCheckbox().checked).toBeTrue();
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

    expect(pageElements.getReturnConditionalValueCheckbox().checked).toBeTrue();
    expect(pageElements.getConditionalValueTextBox().value).toBe('a');
    expect(pageElements.getReturnFallbackValueCheckbox().checked).toBeTrue();
    expect(pageElements.getFallbackValueTextBox().value).toBe('b');
  });

  it('sets settings from form values', () => {
    fillInTextBox(pageElements.getConditionalValueTextBox(), 'a');
    fireEvent.click(pageElements.getReturnFallbackValueCheckbox());
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

  it('sets settings from form values when values are falsy', () => {
    fillInTextBox(pageElements.getConditionalValueTextBox(), '0');
    fireEvent.click(pageElements.getReturnFallbackValueCheckbox());
    fillInTextBox(pageElements.getFallbackValueTextBox(), '0');

    expect(extensionBridge.getSettings()).toEqual({
      leftOperand: '',
      comparison: {
        operator: 'equals'
      },
      rightOperand: '',
      conditionalValue: 0,
      fallbackValue: 0
    });
  });

  it('sets settings values as numbers when it is the case', () => {
    fillInTextBox(pageElements.getConditionalValueTextBox(), '56');
    fireEvent.click(pageElements.getReturnFallbackValueCheckbox());
    fillInTextBox(pageElements.getFallbackValueTextBox(), '76');

    expect(extensionBridge.getSettings()).toEqual({
      leftOperand: '',
      comparison: {
        operator: 'equals'
      },
      rightOperand: '',
      conditionalValue: 56,
      fallbackValue: 76
    });
  });

  it(
    'does not set conditional value when the return conditional value checkbox is ' +
      'not checked',
    () => {
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

      fillInTextBox(pageElements.getConditionalValueTextBox(), '56');
      fireEvent.click(pageElements.getReturnConditionalValueCheckbox());

      expect(extensionBridge.getSettings()).toEqual({
        leftOperand: '%Data Element 1%',
        comparison: {
          operator: 'equals'
        },
        rightOperand: 1,
        fallbackValue: 'b'
      });
    }
  );

  it(
    'does not set fallback value when the return fallback value checkbox is ' +
      'not checked',
    () => {
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

      fillInTextBox(pageElements.getFallbackValueTextBox(), '76');
      fireEvent.click(pageElements.getReturnFallbackValueCheckbox());

      expect(extensionBridge.getSettings()).toEqual({
        leftOperand: '%Data Element 1%',
        comparison: {
          operator: 'equals'
        },
        rightOperand: 1,
        conditionalValue: 'a'
      });
    }
  );
});
