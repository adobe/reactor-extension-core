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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { simulate } from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import RandomNumber, { formConfig } from '../randomNumber';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getMinTextBox: () => screen.getByRole('textbox', { name: /min/i }),
  getMaxTextBox: () => screen.getByRole('textbox', { name: /max/i })
};

describe('random number data element view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(RandomNumber, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        min: 100,
        max: 200
      }
    });

    expect(pageElements.getMinTextBox().value).toBe('100');
    expect(pageElements.getMaxTextBox().value).toBe('200');
  });

  it('sets form values with defaults', () => {
    expect(extensionBridge.validate()).toBe(true);
    expect(pageElements.getMinTextBox().value).toBe('0');
    expect(pageElements.getMaxTextBox().value).toBe('1000000000');
  });

  it('sets default values and validate passes', () => {
    extensionBridge.init({
      settings: {
        min: 0,
        max: 1000000000
      }
    });

    expect(extensionBridge.validate()).toBe(true);
  });

  it('sets settings from form values', () => {
    simulate.clear(pageElements.getMinTextBox());
    userEvent.type(pageElements.getMinTextBox(), '100');

    simulate.clear(pageElements.getMaxTextBox());
    userEvent.type(pageElements.getMaxTextBox(), '200');

    expect(extensionBridge.getSettings()).toEqual({
      min: 100,
      max: 200
    });
  });

  it('sets errors if values are not provided', () => {
    simulate.clear(pageElements.getMinTextBox());
    simulate.clear(pageElements.getMaxTextBox());

    expect(extensionBridge.validate()).toBe(false);

    expect(
      pageElements.getMinTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(
      pageElements.getMaxTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
  });

  it('sets errors if values are not integers', () => {
    simulate.clear(pageElements.getMinTextBox());
    userEvent.type(pageElements.getMinTextBox(), '1.5');
    userEvent.type(pageElements.getMaxTextBox(), 'asdf');

    expect(extensionBridge.validate()).toBe(false);

    expect(
      pageElements.getMinTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(
      pageElements.getMaxTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
  });

  it('sets errors if min is greater than max', () => {
    simulate.clear(pageElements.getMinTextBox());
    userEvent.type(pageElements.getMinTextBox(), '200');

    simulate.clear(pageElements.getMaxTextBox());
    userEvent.type(pageElements.getMaxTextBox(), '100');

    expect(extensionBridge.validate()).toBe(false);

    expect(
      pageElements.getMinTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(
      pageElements.getMaxTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
  });
});
