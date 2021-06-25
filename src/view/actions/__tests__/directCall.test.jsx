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
import sharedTestingElements from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import DirectCallIdentifier, { formConfig } from '../directCall';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getIdentifierTextBox: () =>
    screen.getByRole('textbox', { name: /direct call identifier/i })
};

describe('direct call action view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(DirectCallIdentifier, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        identifier: 'foo'
      }
    });

    expect(pageElements.getIdentifierTextBox().value).toBe('foo');
  });

  it('sets settings from form values', () => {
    userEvent.type(pageElements.getIdentifierTextBox(), 'foo');

    expect(extensionBridge.getSettings()).toEqual({
      identifier: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    fireEvent.focus(pageElements.getIdentifierTextBox());
    fireEvent.blur(pageElements.getIdentifierTextBox());

    expect(
      pageElements.getIdentifierTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('allows user to provide custom detail', async () => {
    extensionBridge.init({
      settings: {
        identifier: 'foo',
        detail: 'return {bar: "baz"}'
      }
    });

    spyOn(extensionBridge, 'openCodeEditor').and.callFake(() => ({
      then(resolve) {
        resolve('return {bar: "stamp"}');
      }
    }));

    fireEvent.click(sharedTestingElements.customCodeEditor.getTriggerButton());

    expect(extensionBridge.getSettings()).toEqual({
      identifier: 'foo',
      detail: 'return {bar: "stamp"}'
    });
  });
});
