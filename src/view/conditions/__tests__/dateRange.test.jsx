/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import { mount } from 'enzyme';
import Datepicker from '@react/react-spectrum/Datepicker';
import ComboBox from '@react/react-spectrum/ComboBox';
import WrappedField from '../../components/wrappedField';
import DateRange, { formConfig } from '../dateRange';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const fields = wrapper.find(WrappedField);
  const startField = fields.filterWhere(n => n.prop('name') === 'start');
  const startDatepicker = startField.find(Datepicker);
  const endField = fields.filterWhere(n => n.prop('name') === 'end');
  const endDatepicker = endField.find(Datepicker);
  const timezoneField = fields.filterWhere(n => n.prop('name') === 'timezone');
  const timezoneComboBox = timezoneField.find(ComboBox);

  return {
    startDatepicker,
    endDatepicker,
    timezoneComboBox
  };
};

describe('date range condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(DateRange, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        start: '2017-11-03T17:24:00Z',
        end: '2017-11-29T16:12:00Z',
        timezone: 'US/Mountain'
      }
    });

    const { startDatepicker, endDatepicker, timezoneComboBox } = getReactComponents(instance);

    expect(startDatepicker.props().value).toBe('2017-11-03 11:24');
    expect(endDatepicker.props().value).toBe('2017-11-29 09:12');
    expect(timezoneComboBox.props().value).toBe('US/Mountain');
  });

  it('sets form values using GMT if not provided on settings', () => {
    extensionBridge.init({
      settings: {
        start: '2017-11-03T17:24:00Z',
        end: '2017-11-29T16:12:00Z'
      }
    });

    const { startDatepicker, endDatepicker, timezoneComboBox } = getReactComponents(instance);

    expect(startDatepicker.props().value).toBe('2017-11-03 17:24');
    expect(endDatepicker.props().value).toBe('2017-11-29 16:12');
    expect(timezoneComboBox.props().value).toBe('GMT');
  });

  it('sets form values using GMT if invalid timezone provided on settings', () => {
    extensionBridge.init({
      settings: {
        start: '2017-11-03T17:24:00Z',
        end: '2017-11-29T16:12:00Z',
        timezone: 'bogus'
      }
    });

    const { startDatepicker, endDatepicker, timezoneComboBox } = getReactComponents(instance);

    expect(startDatepicker.props().value).toBe('2017-11-03 17:24');
    expect(endDatepicker.props().value).toBe('2017-11-29 16:12');
    expect(timezoneComboBox.props().value).toBe('GMT');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { startDatepicker, endDatepicker, timezoneComboBox } = getReactComponents(instance);

    startDatepicker.props().onChange('2017-11-03 11:24');
    endDatepicker.props().onChange('2017-11-29 09:12');
    timezoneComboBox.props().onChange('US/Mountain');

    expect(extensionBridge.getSettings()).toEqual({
      start: '2017-11-03T17:24:00Z',
      end: '2017-11-29T16:12:00Z',
      timezone: 'US/Mountain'
    });
  });

  it('sets errors on both dates if neither value is provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { startDatepicker, endDatepicker } = getReactComponents(instance);

    expect(startDatepicker.props().validationState).toBe('invalid');
    expect(endDatepicker.props().validationState).toBe('invalid');
  });

  it('sets no errors if either start or end date is provided', () => {
    extensionBridge.init({
      settings: {
        start: '2017-11-03T17:24:00Z'
      }
    });

    const { startDatepicker, endDatepicker } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(true);
    expect(startDatepicker.props().validationState).toBeUndefined();
    expect(endDatepicker.props().validationState).toBeUndefined();
  });
});
