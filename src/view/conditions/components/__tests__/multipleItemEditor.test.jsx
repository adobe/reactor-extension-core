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

import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { TextField } from '@adobe/react-spectrum';
import MultipleItemEditor from '../../../components/multipleItemEditor';

// react-testing-library element selectors
const pageElements = {
  getAddSubDomainRowButton: () => {
    return screen.getByRole('button', { name: /add another/i });
  },
  getInterstitialLabels: () => {
    return document.querySelectorAll('div[data-type="interstitial"]');
  },
  getRegexRows: () => {
    return [].slice
      .call(document.querySelectorAll('div[data-type="row"]')) // get the dom nodes
      .map((domNode) => {
        return {
          domNode,
          // Decorate the returned rows to have react-testing-library getters
          withinRow: {
            getTextBox: () => {
              return within(domNode).getByRole('textbox', {
                name: /row input box/i
              });
            },
            regex: {
              getToggleSwitch: () => {
                return within(domNode).getByRole('switch', { name: /regex/i });
              },
              getTestButton: () => {
                return within(domNode).getByRole('button', { name: /test/i });
              }
            },
            getRemoveButton: () => {
              return within(domNode).getByRole('img', { hidden: true });
            }
          }
        };
      });
  }
};

const getTestProps = () => ({
  fields: {
    map: (fn) => [0, 1].map((index) => fn(`props[${index}]`, index)),
    push: jasmine.createSpy('push'),
    remove: jasmine.createSpy('remove'),
    length: 2
  },
  renderItem: jasmine
    .createSpy('renderItem')
    .and.callFake((rowData) => (
      <TextField label="Row Input Box" value={rowData} />
    )),
  createItem: jasmine.createSpy().and.returnValue({}),
  interstitialLabel: 'OR'
});

describe('multiple item editor', () => {
  let props;

  beforeEach(() => {
    props = getTestProps();
    render(<MultipleItemEditor {...props} />);
  });

  it('renders a row for each item', () => {
    const rows = pageElements.getRegexRows();
    expect(rows.length).toBe(2);

    const [firstRow, secondRow] = rows;
    expect(firstRow.withinRow.getTextBox().value).toBe('props[0]');
    expect(secondRow.withinRow.getTextBox().value).toBe('props[1]');
  });

  it('renders an interstitial label', () => {
    const interstitialLabels = pageElements.getInterstitialLabels();
    expect(interstitialLabels.length).toBe(1);
    expect(interstitialLabels[0].innerHTML).toBe('OR');
  });

  it('calls fields.push when add button is clicked', () => {
    fireEvent.click(pageElements.getAddSubDomainRowButton());
    expect(props.createItem).toHaveBeenCalled();
    expect(props.fields.push).toHaveBeenCalledWith({});
  });

  it('calls fields.remove when remove button is clicked for a row', () => {
    const rows = pageElements.getRegexRows();
    expect(rows.length).toBe(2);

    fireEvent.click(rows[1].withinRow.getRemoveButton());
    const someMouseEvent = jasmine.any(Object);
    expect(props.fields.remove).toHaveBeenCalledWith(1, someMouseEvent);
  });
});
