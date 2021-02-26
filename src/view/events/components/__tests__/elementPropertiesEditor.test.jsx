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
import ElementPropertiesEditor, {
  formConfig
} from '../elementPropertiesEditor';
import bootstrap from '../../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getRows: () => {
    return [].slice
      .call(document.querySelectorAll('div[data-row]'))
      .map((domNode) => ({
        domNode,
        withinRow: {
          getNameTextBox: () => {
            return within(domNode).getByRole('textbox', { name: /property/i });
          },
          getValueTextBox: () => {
            return within(domNode).getByRole('textbox', { name: /value/i });
          },
          getRegexToggleSwitch: () => {
            return within(domNode).getByRole('switch', { name: /regex/i });
          },
          getRemoveButton: () => {
            return within(domNode).getByRole('button', { name: /remove row/i });
          }
        }
      }));
  },
  getAddButton: () => screen.getByRole('button', { name: /add/i })
};

describe('elementPropertiesEditor', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(ElementPropertiesEditor, formConfig, extensionBridge));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementProperties: [
          {
            name: 'some prop',
            value: 'some value',
            valueIsRegex: true
          }
        ]
      }
    });

    const rows = pageElements.getRows();
    expect(rows.length).toBe(1);
    const [row] = rows;

    expect(row.withinRow.getNameTextBox().value).toBe('some prop');
    expect(row.withinRow.getValueTextBox().value).toBe('some value');
    expect(row.withinRow.getRegexToggleSwitch().checked).toBeTrue();
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const [row] = pageElements.getRows();

    userEvent.type(row.withinRow.getNameTextBox(), 'some prop set');
    userEvent.type(row.withinRow.getValueTextBox(), 'some value set');
    fireEvent.click(row.withinRow.getRegexToggleSwitch());

    const { elementProperties } = extensionBridge.getSettings();
    expect(elementProperties).toEqual([
      {
        name: 'some prop set',
        value: 'some value set',
        valueIsRegex: true
      }
    ]);
  });

  it('sets error if element property name field is empty and value is not empty', async () => {
    const [row] = pageElements.getRows();
    fireEvent.focus(row.withinRow.getValueTextBox());
    userEvent.type(row.withinRow.getValueTextBox(), 'foo');
    fireEvent.blur(row.withinRow.getValueTextBox());

    expect(extensionBridge.validate()).toBe(false);
    expect(
      row.withinRow.getNameTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
  });

  it('creates a new row when the add button is clicked', () => {
    expect(pageElements.getRows().length).toBe(1);
    fireEvent.click(pageElements.getAddButton());
    expect(pageElements.getRows().length).toBe(2);
  });

  it('deletes a row when requested from row', () => {
    extensionBridge.init({
      settings: {
        elementProperties: [
          {
            name: 'some prop',
            value: 'some value',
            valueIsRegex: true
          },
          {
            name: 'some prop2',
            value: 'some value2',
            valueIsRegex: true
          }
        ]
      }
    });

    expect(pageElements.getRows().length).toBe(2);
    fireEvent.click(pageElements.getRows()[0].withinRow.getRemoveButton());

    const rows = pageElements.getRows();
    expect(rows.length).toBe(1);
    const [row] = rows;

    expect(row.withinRow.getNameTextBox().value).toBe('some prop2');
    expect(row.withinRow.getValueTextBox().value).toBe('some value2');
    expect(row.withinRow.getRegexToggleSwitch().checked).toBeTrue();
  });
});
