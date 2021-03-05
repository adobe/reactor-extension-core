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
import DelayType, { formConfig } from '../delayType';
import bootstrap from '../../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  radioGroup: {
    getImmediately: () => screen.getByRole('radio', { name: /immediately/i }),
    getAfterDelay: () => screen.getByRole('radio', { name: /after a delay/i })
  },
  getTextBox: () => screen.getByRole('textbox', { name: /delay/i }),
  getDataElementModalTrigger: () => {
    return screen.getByRole('button', { name: /select a data element/i });
  }
};

describe('delayType', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(DelayType, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  describe('sets form values', () => {
    it('when settings contains delay value', () => {
      extensionBridge.init({
        settings: {
          delay: 500
        }
      });

      expect(pageElements.radioGroup.getAfterDelay().checked).toBeTrue();
      expect(pageElements.getTextBox().value).toBe('500');
    });

    it("when settings doesn't contain delay value", () => {
      extensionBridge.init({ settings: {} });

      expect(screen.queryAllByRole('textbox').length).toBe(0);
      expect(pageElements.radioGroup.getImmediately().checked).toBeTrue();
    });
  });

  it('has the specific element radio button selected', () => {
    expect(screen.queryAllByRole('textbox').length).toBe(0);
    expect(pageElements.radioGroup.getImmediately().checked).toBeTrue();
  });

  it('sets settings from form values', () => {
    fireEvent.click(pageElements.radioGroup.getAfterDelay());
    userEvent.type(pageElements.getTextBox(), '100');

    expect(extensionBridge.getSettings()).toEqual({
      delay: 100
    });
  });

  it(
    'sets settings without delay when trigger immediately is selected and delay ' +
      'contains a value',
    () => {
      fireEvent.click(pageElements.radioGroup.getAfterDelay());
      userEvent.type(pageElements.getTextBox(), '100');
      fireEvent.click(pageElements.radioGroup.getImmediately());

      expect(extensionBridge.getSettings().delay).toBeUndefined();
    }
  );

  it('sets error if delay radio is selected and the delay field is empty', () => {
    fireEvent.click(pageElements.radioGroup.getAfterDelay());
    fireEvent.focus(pageElements.getTextBox());
    fireEvent.blur(pageElements.getTextBox());

    expect(pageElements.getTextBox().hasAttribute('aria-invalid')).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('sets error if the delay field is not a number', () => {
    fireEvent.click(pageElements.radioGroup.getAfterDelay());
    fireEvent.focus(pageElements.getTextBox());
    userEvent.type(pageElements.getTextBox(), 'aaa');
    fireEvent.blur(pageElements.getTextBox());

    expect(pageElements.getTextBox().hasAttribute('aria-invalid')).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('delayType handles data element names just fine', () => {
    fireEvent.click(pageElements.radioGroup.getAfterDelay());
    userEvent.type(pageElements.getTextBox(), '%Data Element 1%');
    expect(extensionBridge.getSettings().delay).toBe('%Data Element 1%');
  });

  it('The delayType input supports opening the data element modal', () => {
    spyOn(extensionBridge, 'openDataElementSelector').and.callFake(() => {
      return Promise.resolve();
    });

    fireEvent.click(pageElements.radioGroup.getAfterDelay());
    fireEvent.click(pageElements.getDataElementModalTrigger());
    expect(extensionBridge.openDataElementSelector).toHaveBeenCalledTimes(1);
  });
});
