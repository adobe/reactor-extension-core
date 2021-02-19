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
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import Sampling, { formConfig } from '../sampling';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getRateTextBox: () => screen.getByRole('textbox', { name: /rate/i }),
  getPersistCohortCheckbox: () =>
    screen.getByRole('checkbox', { name: /persist cohort/i })
};

describe('sampling condition view', () => {
  const warningText = new RegExp(
    /Changing the sampling value will reset the cohort the next time the rule is published./,
    'i'
  );
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(Sampling, formConfig, extensionBridge));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        rate: 0.25,
        persistCohort: true
      }
    });

    expect(pageElements.getRateTextBox().value).toBe('25');
    expect(pageElements.getPersistCohortCheckbox().checked).toBeTrue();
  });

  it('sets settings from form values', () => {
    userEvent.clear(pageElements.getRateTextBox());
    userEvent.type(pageElements.getRateTextBox(), '25');
    fireEvent.click(pageElements.getPersistCohortCheckbox());

    expect(extensionBridge.getSettings()).toEqual({
      rate: 0.25,
      persistCohort: true
    });
  });

  it('sets the default form values', () => {
    expect(pageElements.getRateTextBox().value).toBe('50');
    expect(pageElements.getPersistCohortCheckbox().checked).toBeFalse();

    expect(extensionBridge.getSettings()).toEqual({
      rate: 0.5
    });
  });

  it('sets error if rate is not provided', () => {
    fireEvent.focus(pageElements.getRateTextBox());
    userEvent.clear(pageElements.getRateTextBox());
    fireEvent.blur(pageElements.getRateTextBox());
    expect(
      pageElements.getRateTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('sets error if rate is not a number', () => {
    fireEvent.focus(pageElements.getRateTextBox());
    userEvent.clear(pageElements.getRateTextBox());
    userEvent.type(pageElements.getRateTextBox(), 'abc');
    fireEvent.blur(pageElements.getRateTextBox());

    expect(
      pageElements.getRateTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('sets error if rate is less than 0', () => {
    fireEvent.focus(pageElements.getRateTextBox());
    userEvent.clear(pageElements.getRateTextBox());
    userEvent.type(pageElements.getRateTextBox(), '-1');
    fireEvent.blur(pageElements.getRateTextBox());

    expect(
      pageElements.getRateTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('sets error if rate is greater than 101', () => {
    fireEvent.focus(pageElements.getRateTextBox());
    userEvent.clear(pageElements.getRateTextBox());
    userEvent.type(pageElements.getRateTextBox(), '101');
    fireEvent.blur(pageElements.getRateTextBox());

    expect(
      pageElements.getRateTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('sets error if rate is not an integer', () => {
    fireEvent.focus(pageElements.getRateTextBox());
    userEvent.clear(pageElements.getRateTextBox());
    userEvent.type(pageElements.getRateTextBox(), '55.55');
    fireEvent.blur(pageElements.getRateTextBox());

    expect(
      pageElements.getRateTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('shows cohort reset warning when rate changes', () => {
    extensionBridge.init({
      settings: {
        rate: 0.25,
        persistCohort: true
      }
    });

    expect(screen.queryByText(warningText)).toBeFalsy();
    userEvent.clear(pageElements.getRateTextBox());
    userEvent.type(pageElements.getRateTextBox(), '70');
    expect(screen.getByText(warningText)).toBeTruthy();
  });

  it('does not show cohort reset warning when rate changes and condition is new', () => {
    userEvent.type(pageElements.getRateTextBox(), '70');
    expect(screen.queryByText(warningText)).toBeFalsy();
  });

  it(
    'does not show cohort reset warning when rate changes and persist cohort ' +
      'unchecked on last save',
    () => {
      extensionBridge.init({
        settings: {
          rate: 0.25
        }
      });

      userEvent.clear(pageElements.getRateTextBox());
      userEvent.type(pageElements.getRateTextBox(), '70');
      fireEvent.click(pageElements.getPersistCohortCheckbox());

      expect(screen.queryByText(warningText)).toBeFalsy();
    }
  );
});
