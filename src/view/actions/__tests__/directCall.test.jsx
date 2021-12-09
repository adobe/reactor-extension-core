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
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import DirectCallIdentifier, { formConfig } from '../directCall';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getIdentifierTextBox: () => {
    return screen.getByRole('textbox', { name: /direct call identifier/i });
  },
  getRows: () => {
    return [].slice
      .call(document.querySelectorAll('[data-test-detail-row]'))
      .map((domNode) => ({
        domNode,
        withinRow: {
          getEventObjectKeyTextBox: () => {
            return within(domNode).getByPlaceholderText('key', {
              exact: false // ignore case
            });
          },
          getEventObjectValueTextBox: () => {
            return within(domNode).getByPlaceholderText('value', {
              exact: false // ignore case
            });
          }
        }
      }));
  },
  getAddRowButton: () => {
    return screen.getByText(/add another/i);
  }
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
        identifier: 'foo',
        detail: {
          eventObjectEntries: [
            { key: 'first key', value: 'first value' },
            { key: 'second key', value: 'second value' }
          ]
        }
      }
    });

    expect(pageElements.getIdentifierTextBox().value).toBe('foo');
    const eventObjectRows = pageElements.getRows();
    expect(eventObjectRows.length).toBe(2);
    const [firstRow, secondRow] = eventObjectRows;
    expect(firstRow.withinRow.getEventObjectKeyTextBox().value).toBe(
      'first key'
    );
    expect(firstRow.withinRow.getEventObjectValueTextBox().value).toBe(
      'first value'
    );
    expect(secondRow.withinRow.getEventObjectKeyTextBox().value).toBe(
      'second key'
    );
    expect(secondRow.withinRow.getEventObjectValueTextBox().value).toBe(
      'second value'
    );
  });

  it('sets settings from form values', () => {
    userEvent.type(pageElements.getIdentifierTextBox(), 'foo');

    // give a second row
    fireEvent.click(pageElements.getAddRowButton());

    const [firstRow, secondRow] = pageElements.getRows();
    userEvent.type(firstRow.withinRow.getEventObjectKeyTextBox(), 'foo');
    userEvent.type(firstRow.withinRow.getEventObjectValueTextBox(), 'bar');
    userEvent.type(secondRow.withinRow.getEventObjectKeyTextBox(), 'biz');
    userEvent.type(secondRow.withinRow.getEventObjectValueTextBox(), 'baz');

    // add a third row that we won't interact with
    fireEvent.click(pageElements.getAddRowButton());
    expect(pageElements.getRows().length).toBe(3);

    expect(extensionBridge.getSettings()).toEqual({
      identifier: 'foo',
      detail: {
        eventObjectEntries: [
          { key: 'foo', value: 'bar' },
          { key: 'biz', value: 'baz' }
        ]
      }
    });
  });

  it('the always-required fields show errors when they are focused and blurred', () => {
    fireEvent.focus(pageElements.getIdentifierTextBox());
    fireEvent.blur(pageElements.getIdentifierTextBox());

    expect(
      pageElements.getIdentifierTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('the detail rows show errors when appropriate', () => {
    const rows = pageElements.getRows();

    // focus/blurring the boxes
    fireEvent.focus(rows[0].withinRow.getEventObjectKeyTextBox());
    fireEvent.blur(rows[0].withinRow.getEventObjectKeyTextBox());
    expect(
      rows[0].withinRow.getEventObjectKeyTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();
    fireEvent.focus(rows[0].withinRow.getEventObjectValueTextBox());
    fireEvent.blur(rows[0].withinRow.getEventObjectValueTextBox());
    expect(
      rows[0].withinRow
        .getEventObjectValueTextBox()
        .hasAttribute('aria-invalid')
    ).toBeFalse();

    // validate shouldn't cause these empty boxes to show an error
    extensionBridge.validate();
    expect(extensionBridge.getSettings()).toEqual({ identifier: undefined });
    expect(
      rows[0].withinRow.getEventObjectKeyTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();
    expect(
      rows[0].withinRow
        .getEventObjectValueTextBox()
        .hasAttribute('aria-invalid')
    ).toBeFalse();

    // make the value text box invalid
    userEvent.type(rows[0].withinRow.getEventObjectKeyTextBox(), 'foo');
    expect(
      rows[0].withinRow.getEventObjectKeyTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();
    expect(
      rows[0].withinRow
        .getEventObjectValueTextBox()
        .hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.getSettings()).toEqual({ identifier: undefined });

    userEvent.clear(rows[0].withinRow.getEventObjectKeyTextBox());
    userEvent.type(rows[0].withinRow.getEventObjectValueTextBox(), 'foo');

    // make the key text box invalid
    expect(
      rows[0].withinRow.getEventObjectKeyTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(
      rows[0].withinRow
        .getEventObjectValueTextBox()
        .hasAttribute('aria-invalid')
    ).toBeFalse();
    expect(extensionBridge.getSettings()).toEqual({ identifier: undefined });
  });

  it('providing custom detail is optional', async () => {
    extensionBridge.init({
      settings: {
        identifier: 'foo'
      }
    });

    expect(extensionBridge.validate()).toBeTrue();
    expect(extensionBridge.getSettings()).toEqual({
      identifier: 'foo'
    });
  });
});
