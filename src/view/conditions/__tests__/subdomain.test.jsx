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
import Subdomain, { formConfig } from '../subdomain';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getAddSubDomainRowButton: () => {
    return screen.getByRole('button', { name: /add another/i });
  },
  getRegexRows: () => {
    return [].slice
      .call(document.querySelectorAll('div[data-type="row"]')) // get the dom nodes
      .map((domNode) => {
        return {
          domNode,
          // Decorate the returned rows to have react-testing-library getters
          withinRow: {
            getSubDomainTextBox: () => {
              return within(domNode).getByRole('textbox', {
                name: /subdomain/i
              });
            },
            regex: {
              getToggleSwitch: () => {
                return within(domNode).getByRole('switch', { name: /regex/i });
              },
              getTestButton: () => {
                return within(domNode).getByRole('button', { name: /test/i });
              }
            }
          }
        };
      });
  }
};

const testProps = {
  settings: {
    subdomains: [
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

describe('subdomain condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(Subdomain, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init(testProps);

    const rows = pageElements.getRegexRows();
    expect(rows.length).toBe(2);

    const [firstRow, secondRow] = rows;

    expect(firstRow.withinRow.getSubDomainTextBox().value).toBe('foo');
    expect(firstRow.withinRow.regex.getToggleSwitch().checked).toBe(false);

    expect(secondRow.withinRow.getSubDomainTextBox().value).toBe('bar');
    expect(secondRow.withinRow.regex.getToggleSwitch().checked).toBe(true);
  });

  it('sets settings from form values', () => {
    const rows = pageElements.getRegexRows();
    expect(rows.length).toBe(1);
    const [row] = rows;

    userEvent.type(row.withinRow.getSubDomainTextBox(), 'goo');
    fireEvent.click(row.withinRow.regex.getToggleSwitch());

    expect(extensionBridge.getSettings()).toEqual({
      subdomains: [
        {
          value: 'goo',
          valueIsRegex: true
        }
      ]
    });
  });

  it('sets errors if required values are not provided', () => {
    const [row] = pageElements.getRegexRows();
    expect(
      row.withinRow.getSubDomainTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();

    fireEvent.focus(row.withinRow.getSubDomainTextBox());
    fireEvent.blur(row.withinRow.getSubDomainTextBox());

    expect(
      row.withinRow.getSubDomainTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });

  it('regex rows are independent', () => {
    spyOn(extensionBridge, 'openRegexTester').and.callFake(() => ({
      then(resolve) {
        resolve('Edited Regex 1234');
      }
    }));

    fireEvent.click(pageElements.getAddSubDomainRowButton());

    const rows = pageElements.getRegexRows();
    const [firstRow, secondRow] = rows;
    expect(rows.length).toBe(2);

    userEvent.type(firstRow.withinRow.getSubDomainTextBox(), 'first row value');
    userEvent.type(
      secondRow.withinRow.getSubDomainTextBox(),
      'second row value'
    );

    fireEvent.click(secondRow.withinRow.regex.getToggleSwitch());
    fireEvent.click(secondRow.withinRow.regex.getTestButton());

    expect(firstRow.withinRow.getSubDomainTextBox().value).toBe(
      'first row value'
    );
    expect(secondRow.withinRow.getSubDomainTextBox().value).toBe(
      'Edited Regex 1234'
    );
  });
});
