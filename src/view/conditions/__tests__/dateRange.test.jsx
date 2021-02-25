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
import { clickSpectrumOption } from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import DateRange, { formConfig } from '../dateRange';
import bootstrap from '../../bootstrap';

// todo: need to debug why we can't triple click and clear fields
//  then use `userEvent.clear` and delete this function.
const simulate = {
  clear: (element) => {
    fireEvent.change(element, { target: { value: '' } });
  }
};

// react-testing-library element selectors
const pageElements = {
  getDatePickers: () => {
    return [].slice
      .call(
        document.querySelectorAll(
          'div[role="combobox"][aria-haspopup="dialog"]'
        )
      )
      .map((domNode) => ({
        domNode,
        withinPicker: {
          getTimeTextBox: () => {
            return within(domNode).getByRole('textbox');
          },
          getTimeTrigger: () => {
            return within(domNode).getByRole('button');
          }
        }
      }));
  },
  timeZoneDropdown: {
    getTrigger: () => {
      const [trigger] = screen.queryAllByRole('button').slice(-1);
      return trigger;
    },
    getTextBox: () => {
      return screen.getByRole('combobox', { name: /timezone/i });
    },
    waitForMountainTimeZoneOption: () => {
      return screen.findByRole('option', { name: /us\/mountain/i });
    }
  },
  waitForOptionsToAppear: () => {
    return screen.findAllByRole('option');
  },
  waitForCalendarDialog: () => {
    return screen.findByRole('dialog', { name: /calendar/i });
  }
};

describe('date range condition view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(DateRange, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        start: '2017-11-03T17:24:00Z',
        end: '2017-11-29T16:12:00Z',
        timezone: 'US/Mountain'
      }
    });

    const [startDatePicker, endDatePicker] = pageElements.getDatePickers();

    expect(startDatePicker.withinPicker.getTimeTextBox().value).toBe(
      '2017-11-03 11:24'
    );
    expect(endDatePicker.withinPicker.getTimeTextBox().value).toBe(
      '2017-11-29 09:12'
    );
    expect(pageElements.timeZoneDropdown.getTextBox().value).toBe(
      'US/Mountain'
    );
  });

  it('sets form values using GMT if not provided on settings', () => {
    extensionBridge.init({
      settings: {
        start: '2017-11-03T17:24:00Z',
        end: '2017-11-29T16:12:00Z'
      }
    });

    const [startDatePicker, endDatePicker] = pageElements.getDatePickers();

    expect(startDatePicker.withinPicker.getTimeTextBox().value).toBe(
      '2017-11-03 17:24'
    );
    expect(endDatePicker.withinPicker.getTimeTextBox().value).toBe(
      '2017-11-29 16:12'
    );
    expect(pageElements.timeZoneDropdown.getTextBox().value).toBe('GMT');
  });

  it('sets form values using GMT if invalid timezone provided on settings', () => {
    extensionBridge.init({
      settings: {
        start: '2017-11-03T17:24:00Z',
        end: '2017-11-29T16:12:00Z',
        timezone: 'bogus'
      }
    });

    const [startDatePicker, endDatePicker] = pageElements.getDatePickers();

    expect(startDatePicker.withinPicker.getTimeTextBox().value).toBe(
      '2017-11-03 17:24'
    );
    expect(endDatePicker.withinPicker.getTimeTextBox().value).toBe(
      '2017-11-29 16:12'
    );
    expect(pageElements.timeZoneDropdown.getTextBox().value).toBe('GMT');
  });

  it('sets settings from form values', async () => {
    const [startDatePicker, endDatePicker] = pageElements.getDatePickers();

    fireEvent.focus(startDatePicker.withinPicker.getTimeTextBox());
    userEvent.type(
      startDatePicker.withinPicker.getTimeTextBox(),
      '2017-11-03 11:24'
    );
    fireEvent.blur(startDatePicker.withinPicker.getTimeTextBox());

    fireEvent.focus(endDatePicker.withinPicker.getTimeTextBox());
    userEvent.type(
      endDatePicker.withinPicker.getTimeTextBox(),
      '2017-11-29 09:12'
    );
    fireEvent.blur(endDatePicker.withinPicker.getTimeTextBox());

    fireEvent.click(pageElements.timeZoneDropdown.getTrigger());
    await pageElements.waitForOptionsToAppear();
    simulate.clear(pageElements.timeZoneDropdown.getTextBox());
    userEvent.type(pageElements.timeZoneDropdown.getTextBox(), 'US/Mountain');
    const option = await pageElements.timeZoneDropdown.waitForMountainTimeZoneOption();
    clickSpectrumOption(option);

    expect(extensionBridge.getSettings()).toEqual({
      start: '2017-11-03T17:24:00Z',
      end: '2017-11-29T16:12:00Z',
      timezone: 'US/Mountain'
    });
  });

  it('sets errors on both dates if neither value is provided', () => {
    expect(extensionBridge.validate()).toBe(false);

    const [startDatePicker, endDatePicker] = pageElements.getDatePickers();

    expect(
      startDatePicker.withinPicker
        .getTimeTextBox()
        .className.indexOf('is-invalid')
    ).not.toBe(-1);
    expect(
      endDatePicker.withinPicker
        .getTimeTextBox()
        .className.indexOf('is-invalid')
    ).not.toBe(-1);

    expect(extensionBridge.getSettings().timezone).toBe('GMT');
  });

  it('sets no errors if either start or end date is provided', () => {
    extensionBridge.init({
      settings: {
        start: '2017-11-03T17:24:00Z'
      }
    });

    const [startDatePicker, endDatePicker] = pageElements.getDatePickers();

    expect(extensionBridge.validate()).toBe(true);

    expect(
      startDatePicker.withinPicker
        .getTimeTextBox()
        .className.indexOf('is-invalid')
    ).toBe(-1);
    expect(
      endDatePicker.withinPicker
        .getTimeTextBox()
        .className.indexOf('is-invalid')
    ).toBe(-1);
  });

  it('the startDatePicker opens a calendar component', async () => {
    const [startDatePicker] = pageElements.getDatePickers();
    fireEvent.click(startDatePicker.withinPicker.getTimeTrigger());
    const dialog = await pageElements.waitForCalendarDialog();
    expect(dialog).not.toBeNull();
  });

  it('the startDatePicker opens a calendar component', async () => {
    const [, endDatePicker] = pageElements.getDatePickers();
    fireEvent.click(endDatePicker.withinPicker.getTimeTrigger());
    const dialog = await pageElements.waitForCalendarDialog();
    expect(dialog).not.toBeNull();
  });
});
