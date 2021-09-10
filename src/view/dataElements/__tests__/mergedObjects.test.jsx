/***************************************************************************************
 * Copyright 2021 Adobe. All rights reserved.
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
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import MergedObjects, { formConfig } from '../mergedObjects';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getRows: () => {
    return [].slice
      .call(document.querySelectorAll('div[data-row]'))
      .map((domNode) => ({
        domNode,
        withinRow: {
          getObjectTextBox: () => {
            return within(domNode).getByRole('textbox', { name: /object/i });
          }
        }
      }));
  },
  getAddButton: () => screen.getByRole('button', { name: /add/i })
};

const testProps = {
  settings: {
    objects: ['%foo%', '%bar%']
  }
};

describe('merged objects data element view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(MergedObjects, formConfig));
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

    expect(firstRow.withinRow.getObjectTextBox().value).toBe('%foo%');
    expect(secondRow.withinRow.getObjectTextBox().value).toBe('%bar%');
  });

  it('sets settings from form values', () => {
    expect(pageElements.getRows().length).toBe(1);

    fireEvent.click(pageElements.getAddButton());

    const rows = pageElements.getRows();
    expect(rows.length).toBe(2);
    userEvent.type(rows[0].withinRow.getObjectTextBox(), '%goo%');
    userEvent.type(rows[1].withinRow.getObjectTextBox(), '%boo%');

    expect(extensionBridge.getSettings()).toEqual({
      objects: ['%goo%', '%boo%']
    });
  });

  it('sets errors if required values are not provided', () => {
    const [row] = pageElements.getRows();
    fireEvent.focus(row.withinRow.getObjectTextBox());
    fireEvent.blur(row.withinRow.getObjectTextBox());

    expect(
      row.withinRow.getObjectTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('sets errors if values are not data elements', () => {
    const [row] = pageElements.getRows();
    userEvent.type(row.withinRow.getObjectTextBox(), 'foo');
    fireEvent.blur(row.withinRow.getObjectTextBox());

    expect(
      row.withinRow.getObjectTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });
});
