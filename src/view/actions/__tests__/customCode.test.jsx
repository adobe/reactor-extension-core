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
import {
  isButtonValid,
  sharedTestingElements
} from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import CustomCode, { formConfig } from '../customCode';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getExecuteGloballyCheckbox: () => {
    return screen.getByRole('checkbox', { name: /execute globally/i });
  },
  codeLanguage: {
    radioGroup: {
      getJavaScript: () => {
        return screen.getByRole('radio', { name: /javascript/i });
      },
      getHTML: () => screen.getByRole('radio', { name: /html/i })
    }
  }
};

describe('custom code action view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(CustomCode, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    // html tests
    extensionBridge.init({
      settings: {
        language: 'html',
        source: 'bar'
      }
    });

    expect(pageElements.codeLanguage.radioGroup.getJavaScript().checked).toBe(
      false
    );
    expect(pageElements.codeLanguage.radioGroup.getHTML().checked).toBe(true);
    expect(
      screen.queryByRole('checkbox', { name: /execute globally/i })
    ).toBeNull();

    // javascript tests
    extensionBridge.init({
      settings: {
        language: 'javascript',
        global: true,
        source: 'bar'
      }
    });
    expect(pageElements.codeLanguage.radioGroup.getJavaScript().checked).toBe(
      true
    );
    expect(pageElements.getExecuteGloballyCheckbox().checked).toBe(true);
  });

  it('sets settings from form values', () => {
    fireEvent.click(pageElements.codeLanguage.radioGroup.getHTML());
    expect(extensionBridge.getSettings()).toEqual({
      language: 'html'
    });

    fireEvent.click(pageElements.codeLanguage.radioGroup.getJavaScript());
    fireEvent.click(pageElements.getExecuteGloballyCheckbox());
    expect(extensionBridge.getSettings()).toEqual({
      language: 'javascript',
      global: true
    });
  });

  it('sets errors if required values are not provided', () => {
    expect(
      isButtonValid(sharedTestingElements.customCodeEditor.getTriggerButton())
    ).toBeTrue();

    expect(extensionBridge.validate()).toBe(false);
    expect(
      isButtonValid(sharedTestingElements.customCodeEditor.getTriggerButton())
    ).toBeFalse();
  });

  it('allows user to provide custom code', async () => {
    extensionBridge.init({
      settings: {
        language: 'javascript',
        source: 'foo'
      }
    });

    spyOn(extensionBridge, 'openCodeEditor').and.callFake(() => ({
      then(resolve) {
        resolve('foo bar');
      }
    }));

    fireEvent.click(sharedTestingElements.customCodeEditor.getTriggerButton());

    expect(extensionBridge.getSettings()).toEqual({
      language: 'javascript',
      source: 'foo bar'
    });
  });
});
