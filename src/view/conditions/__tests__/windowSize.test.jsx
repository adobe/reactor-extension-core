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

import { fireEvent, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { changePickerValue } from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import WindowSize, { formConfig } from '../windowSize';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getRows: () => {
    return [].slice
      .call(document.querySelectorAll('div[data-row="true"]')) // get the dom nodes
      .map((domNode) => {
        return {
          domNode,
          // Decorate the returned rows to have react-testing-library getters
          withinRow: {
            getDropdownTrigger: () => {
              return within(domNode).getByRole('button', {
                name: /operator/i
              });
            },
            getValueTextBox: () => {
              return within(domNode).getByRole('textbox');
            }
          }
        };
      });
  }
};

describe('window size condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(WindowSize, formConfig, extensionBridge));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets operators to greater than by default', () => {
    const [widthRow, heightRow] = pageElements.getRows();
    expect(
      within(widthRow.withinRow.getDropdownTrigger()).getByText(/greater than/i)
    ).toBeTruthy();
    expect(
      within(heightRow.withinRow.getDropdownTrigger()).getByText(
        /greater than/i
      )
    ).toBeTruthy();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        widthOperator: '=',
        width: 100,
        heightOperator: '<',
        height: 200
      }
    });

    const [widthRow, heightRow] = pageElements.getRows();

    expect(
      within(widthRow.withinRow.getDropdownTrigger()).getByText(/equal to/i)
    ).toBeTruthy();
    expect(widthRow.withinRow.getValueTextBox().value).toBe('100');

    expect(
      within(heightRow.withinRow.getDropdownTrigger()).getByText(/less than/i)
    ).toBeTruthy();
    expect(heightRow.withinRow.getValueTextBox().value).toBe('200');
  });

  it('sets settings from form values', async () => {
    const [widthRow, heightRow] = pageElements.getRows();

    await changePickerValue(
      widthRow.withinRow.getDropdownTrigger(),
      /equal to/i
    );
    userEvent.type(widthRow.withinRow.getValueTextBox(), '100');

    await changePickerValue(
      heightRow.withinRow.getDropdownTrigger(),
      /less than/i
    );
    userEvent.type(heightRow.withinRow.getValueTextBox(), '200');

    expect(extensionBridge.getSettings()).toEqual({
      widthOperator: '=',
      width: 100,
      heightOperator: '<',
      height: 200
    });
  });

  it('sets errors if required values are not provided', () => {
    const [widthRow, heightRow] = pageElements.getRows();

    expect(
      widthRow.withinRow.getValueTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();
    fireEvent.focus(widthRow.withinRow.getValueTextBox());
    fireEvent.blur(widthRow.withinRow.getValueTextBox());
    expect(
      widthRow.withinRow.getValueTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    expect(
      heightRow.withinRow.getValueTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();
    fireEvent.focus(heightRow.withinRow.getValueTextBox());
    fireEvent.blur(heightRow.withinRow.getValueTextBox());
    expect(
      heightRow.withinRow.getValueTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    expect(extensionBridge.validate()).toBe(false);
  });

  it('sets errors if values are not numbers', () => {
    const [widthRow, heightRow] = pageElements.getRows();

    userEvent.type(widthRow.withinRow.getValueTextBox(), '12.abc');
    fireEvent.blur(widthRow.withinRow.getValueTextBox());
    expect(
      widthRow.withinRow.getValueTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    userEvent.type(heightRow.withinRow.getValueTextBox(), '12.abc');
    fireEvent.blur(heightRow.withinRow.getValueTextBox());
    expect(
      heightRow.withinRow.getValueTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();

    expect(extensionBridge.validate()).toBe(false);
  });
});
