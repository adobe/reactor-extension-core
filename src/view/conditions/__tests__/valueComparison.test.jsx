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
import {
  clickSpectrumOption,
  safelyWaitForElementToBeRemoved
} from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import ValueComparison, { formConfig } from '../valueComparison';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getLeftOperandTextBox: () => {
    return screen.getByRole('textbox', { name: /left operand/i });
  },
  getLeftOperandDataElementTrigger: () => {
    const [left] = screen.getAllByRole('button', {
      name: /select a data element/i
    });
    return left;
  },
  getOperatorDropdownTrigger: () => {
    return screen.getByRole('button', { name: /operator/i });
  },
  getRightOperandTextBox: () => {
    return screen.getByRole('textbox', { name: /right operand/i });
  },
  getRightOperandDataElementTrigger: () => {
    const [, right] = screen.getAllByRole('button', {
      name: /select a data element/i
    });
    return right;
  },
  getCaseInsensitiveCheckBox: () => {
    return screen.getByRole('checkbox', { name: /case insensitive/i });
  },
  waitForDynamicOptionText: (text) => {
    // return screen.findByRole('option', { name: new RegExp(text, 'i') });
    return screen.findByRole('option', { name: text });
  }
};

describe('value comparison condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(ValueComparison, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  describe('equal-based comparisons', () => {
    [
      { operator: 'equals', text: new RegExp(/equals/, 'i') },
      { operator: 'doesNotEqual', text: new RegExp(/does not equal/, 'i') }
    ].forEach(({ operator, text }) => {
      describe(`when operator is ${operator}`, () => {
        it('sets form values from settings ', () => {
          extensionBridge.init({
            settings: {
              leftOperand: '%foo%',
              comparison: {
                operator,
                caseInsensitive: true
              },
              // We're using 0 here because it also tests whether falsy values
              // are handled appropriately.
              rightOperand: 0
            }
          });

          expect(pageElements.getLeftOperandTextBox().value).toBe('%foo%');
          expect(
            within(pageElements.getOperatorDropdownTrigger()).getByText(text)
          ).toBeTruthy();
          expect(pageElements.getRightOperandTextBox().value).toBe('0');
          expect(pageElements.getCaseInsensitiveCheckBox().checked).toBeTrue();
        });

        it('sets settings from form values', async () => {
          userEvent.type(pageElements.getLeftOperandTextBox(), '%foo%');

          fireEvent.click(pageElements.getOperatorDropdownTrigger());
          const option = await pageElements.waitForDynamicOptionText(text);
          clickSpectrumOption(option);
          await safelyWaitForElementToBeRemoved(() =>
            screen.queryByRole('option', { name: text })
          );

          userEvent.type(pageElements.getRightOperandTextBox(), '123');
          fireEvent.click(pageElements.getCaseInsensitiveCheckBox());

          expect(extensionBridge.getSettings()).toEqual({
            leftOperand: '%foo%',
            comparison: {
              operator,
              caseInsensitive: true
            },
            rightOperand: 123
          });
        });

        it('sets errors if required values are not provided', () => {
          extensionBridge.init({
            settings: {
              comparison: {
                operator
              }
            }
          });

          // this field is required
          fireEvent.focus(pageElements.getLeftOperandTextBox());
          fireEvent.blur(pageElements.getLeftOperandTextBox());
          expect(
            pageElements.getLeftOperandTextBox().hasAttribute('aria-invalid')
          ).toBeTrue();

          expect(extensionBridge.validate()).toBe(false);

          // We allow empty strings for equals operands because users may want to check to
          // see if a value equals an empty string.
          expect(
            pageElements.getRightOperandTextBox().hasAttribute('aria-invalid')
          ).toBeFalse();
        });
      });
    });
  });

  describe('string-based comparisons', () => {
    [
      { operator: 'contains', text: new RegExp(/contains$/, 'i') },
      {
        operator: 'doesNotContain',
        text: new RegExp(/does not contain$/, 'i')
      },
      { operator: 'startsWith', text: new RegExp(/starts with$/, 'i') },
      {
        operator: 'doesNotStartWith',
        text: new RegExp(/does not start with$/, 'i')
      },
      { operator: 'endsWith', text: new RegExp(/ends with$/, 'i') },
      {
        operator: 'doesNotEndWith',
        text: new RegExp(/does not end with$/, 'i')
      },
      { operator: 'matchesRegex', text: new RegExp(/matches regex$/, 'i') },
      {
        operator: 'doesNotMatchRegex',
        text: new RegExp(/does not match regex$/, 'i')
      }
    ].forEach(({ operator, text }) => {
      describe(`when operator is ${operator}`, () => {
        it('sets form values from settings ', () => {
          extensionBridge.init({
            settings: {
              leftOperand: '%foo%',
              comparison: {
                operator,
                caseInsensitive: true
              },
              rightOperand: 'bar'
            }
          });

          expect(pageElements.getLeftOperandTextBox().value).toBe('%foo%');
          expect(
            within(pageElements.getOperatorDropdownTrigger()).getByText(text)
          ).toBeTruthy();
          expect(pageElements.getRightOperandTextBox().value).toBe('bar');
          expect(pageElements.getCaseInsensitiveCheckBox().checked).toBeTrue();
        });

        it('sets settings from form values', async () => {
          userEvent.type(pageElements.getLeftOperandTextBox(), '%foo%');

          fireEvent.click(pageElements.getOperatorDropdownTrigger());
          const option = await pageElements.waitForDynamicOptionText(text);
          clickSpectrumOption(option);
          await safelyWaitForElementToBeRemoved(() =>
            screen.queryByRole('option', { name: text })
          );

          userEvent.type(pageElements.getRightOperandTextBox(), 'bar');
          fireEvent.click(pageElements.getCaseInsensitiveCheckBox());

          expect(extensionBridge.getSettings()).toEqual({
            leftOperand: '%foo%',
            comparison: {
              operator,
              caseInsensitive: true
            },
            rightOperand: 'bar'
          });
        });

        it('sets errors if required values are not provided', () => {
          extensionBridge.init({
            settings: {
              comparison: {
                operator
              }
            }
          });

          expect(extensionBridge.validate()).toBe(false);

          expect(
            pageElements.getLeftOperandTextBox().hasAttribute('aria-invalid')
          ).toBeTrue();
          expect(
            pageElements.getRightOperandTextBox().hasAttribute('aria-invalid')
          ).toBeTrue();
        });
      });
    });

    describe('number-based comparisons', () => {
      [
        { operator: 'lessThan', text: new RegExp(/is less than$/, 'i') },
        {
          operator: 'lessThanOrEqual',
          text: new RegExp(/is less than or equal to$/, 'i')
        },
        { operator: 'greaterThan', text: new RegExp(/is greater than$/, 'i') },
        {
          operator: 'greaterThanOrEqual',
          text: new RegExp(/is greater than or equal to$/, 'i')
        }
      ].forEach(({ operator, text }) => {
        describe(`when operator is ${operator}`, () => {
          it('sets form values from settings', () => {
            extensionBridge.init({
              settings: {
                leftOperand: '%foo%',
                comparison: {
                  operator
                },
                rightOperand: 456
              }
            });

            expect(pageElements.getLeftOperandTextBox().value).toBe('%foo%');
            expect(
              within(pageElements.getOperatorDropdownTrigger()).findByText(text)
            ).toBeTruthy();
            expect(pageElements.getRightOperandTextBox().value).toBe('456');
          });

          it('sets settings from form values', async () => {
            userEvent.type(pageElements.getLeftOperandTextBox(), '%foo%');

            fireEvent.click(pageElements.getOperatorDropdownTrigger());
            const option = await pageElements.waitForDynamicOptionText(text);
            clickSpectrumOption(option);
            await safelyWaitForElementToBeRemoved(() =>
              screen.queryByRole('option', { name: text })
            );

            userEvent.type(pageElements.getRightOperandTextBox(), '456');

            expect(extensionBridge.getSettings()).toEqual({
              leftOperand: '%foo%',
              comparison: {
                operator
              },
              rightOperand: 456
            });
          });

          it('sets errors if required values are not provided', () => {
            extensionBridge.init({
              settings: {
                leftOperand: '',
                comparison: {
                  operator
                },
                rightOperand: ''
              }
            });

            expect(extensionBridge.validate()).toBe(false);

            expect(
              pageElements.getLeftOperandTextBox().hasAttribute('aria-invalid')
            ).toBeTrue();
            expect(
              pageElements.getRightOperandTextBox().hasAttribute('aria-invalid')
            ).toBeTrue();
          });
        });
      });
    });

    describe('static right operand comparisons', () => {
      [
        { operator: 'isTrue', text: new RegExp(/is true/, 'i') },
        {
          operator: 'isTruthy',
          text: new RegExp(/is truthy/, 'i')
        },
        { operator: 'isFalse', text: new RegExp(/is false/, 'i') },
        {
          operator: 'isFalsy',
          text: new RegExp(/is falsy/, 'i')
        }
      ].forEach(({ operator, text }) => {
        describe(`when operator is ${operator}`, () => {
          it('sets form values from settings', () => {
            extensionBridge.init({
              settings: {
                leftOperand: '%foo%',
                comparison: {
                  operator
                }
              }
            });

            expect(pageElements.getLeftOperandTextBox().value).toBe('%foo%');
            expect(
              within(pageElements.getOperatorDropdownTrigger()).getByText(text)
            ).toBeTruthy();
          });

          it('sets settings from form values', async () => {
            userEvent.type(pageElements.getLeftOperandTextBox(), '%foo%');

            fireEvent.click(pageElements.getOperatorDropdownTrigger());
            const option = await pageElements.waitForDynamicOptionText(text);
            clickSpectrumOption(option);

            expect(extensionBridge.getSettings()).toEqual({
              leftOperand: '%foo%',
              comparison: {
                operator
              }
            });
          });

          it('sets errors if required values are not provided', () => {
            extensionBridge.init({
              settings: {
                comparison: {
                  operator
                }
              }
            });
            expect(extensionBridge.validate()).toBe(false);
            expect(
              pageElements.getLeftOperandTextBox().hasAttribute('aria-invalid')
            ).toBeTrue();
          });
        });
      });
    });

    it('warns user about no type conversions for specific string values', () => {
      extensionBridge.init({
        settings: {
          leftOperand: '%foo%',
          comparison: {
            operator: 'equals',
            caseInsensitive: true
          },
          rightOperand: 'true'
        }
      });

      expect(screen.getByText(/Be aware that the value/i)).toBeTruthy();
    });
  });

  it('The left operand can trigger the data element modal', () => {
    spyOn(extensionBridge, 'openDataElementSelector').and.callFake(() => ({
      then(resolve) {
        resolve('%foo bar%');
      }
    }));

    fireEvent.click(pageElements.getLeftOperandDataElementTrigger());

    expect(extensionBridge.getSettings().leftOperand).toBe('%foo bar%');
    expect(extensionBridge.getSettings().rightOperand).toBeFalsy();
  });

  it('The right operand can trigger the data element modal', () => {
    spyOn(extensionBridge, 'openDataElementSelector').and.callFake(() => ({
      then(resolve) {
        resolve('%foo bar%');
      }
    }));

    fireEvent.click(pageElements.getRightOperandDataElementTrigger());

    expect(extensionBridge.getSettings().rightOperand).toBe('%foo bar%');
    expect(extensionBridge.getSettings().leftOperand).toBeFalsy();
  });
});
