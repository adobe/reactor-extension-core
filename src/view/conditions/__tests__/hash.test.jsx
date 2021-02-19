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
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import Hash, { formConfig } from '../hash';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getRows: () => {
    return [].slice
      .call(document.querySelectorAll('div[data-row]'))
      .map((domNode) => ({
        domNode,
        withinRow: {
          getHashTextBox: () => {
            return within(domNode).getByRole('textbox', { name: /hash/i });
          },
          getRegexToggleSwitch: () => {
            return within(domNode).getByRole('switch', { name: /regex/i });
          }
        }
      }));
  }
};

const testProps = {
  settings: {
    hashes: [
      {
        value: 'foo'
      },
      {
        value: 'bar',
        valueIsRegex: true
      }
    ]
  }
};

describe('hash condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(Hash, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init(testProps);

    const rows = pageElements.getRows();
    expect(rows.length).toBe(2);
    const [firstRow, secondRow] = rows;

    expect(firstRow.withinRow.getHashTextBox().value).toBe('foo');
    expect(firstRow.withinRow.getRegexToggleSwitch().checked).toBeFalse();

    expect(secondRow.withinRow.getHashTextBox().value).toBe('bar');
    expect(secondRow.withinRow.getRegexToggleSwitch().checked).toBeTrue();
  });

  it('sets settings from form values', () => {
    const [row] = pageElements.getRows();
    userEvent.type(row.withinRow.getHashTextBox(), 'goo');
    fireEvent.click(row.withinRow.getRegexToggleSwitch());

    expect(extensionBridge.getSettings()).toEqual({
      hashes: [
        {
          value: 'goo',
          valueIsRegex: true
        }
      ]
    });
  });

  it('sets errors if required values are not provided', () => {
    expect(extensionBridge.validate()).toBe(false);

    expect(
      pageElements
        .getRows()[0]
        .withinRow.getHashTextBox()
        .hasAttribute('aria-invalid')
    ).toBeTrue();
  });
});
