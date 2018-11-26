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

import React from 'react';
import moment from 'moment-timezone';
import Datepicker from '@react/react-spectrum/Datepicker';
import ComboBox from '@react/react-spectrum/ComboBox';
import InfoTip from '../components/infoTip';
import WrappedField from '../components/wrappedField';

import './dateRange.styl';

const DEFAULT_TIMEZONE = 'GMT';
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

const timezoneOptions = moment.tz.names();

const DateRange = () => (
  <div className="u-clearfix">
    <label className="u-gapRight u-gapBottom u-noWrap u-floatLeft">
      <span className="u-verticalAlignMiddle u-gapRight">The date and time is after </span>
      <WrappedField
        name="start"
        component={Datepicker}
        type="datetime"
      />
      <InfoTip className="u-noPaddingRight" placement="bottom">
        Time should be specified in 24-hour time. Leaving the start date blank will allow the
        condition to pass anytime before the end date.
      </InfoTip>
    </label>
    <label className="u-gapRight u-gapBottom u-noWrap u-floatLeft">
      <span className="u-verticalAlignMiddle u-gapRight">and before</span>
      <WrappedField
        name="end"
        component={Datepicker}
        type="datetime"
      />
      <InfoTip className="u-noPaddingRight" placement="bottom">
        Time should be specified in 24-hour time. Leaving the end date blank will allow the
        condition to pass anytime after the start date.
      </InfoTip>
    </label>
    <label className="u-gapRight u-gapBottom u-noWrap u-floatLeft">
      <span className="u-verticalAlignMiddle u-gapRight">in time zone</span>
      <WrappedField
        name="timezone"
        component={ComboBox}
        options={timezoneOptions}
      />
    </label>
  </div>
);

export default DateRange;

export const formConfig = {
  settingsToFormValues(values, settings) {
    values = {
      ...values
    };

    let { timezone } = settings;

    if (moment.tz.names().indexOf(timezone) === -1) {
      timezone = DEFAULT_TIMEZONE;
    }

    if (settings.start) {
      values.start = moment.tz(settings.start, timezone).format(DATETIME_FORMAT);
    }

    if (settings.end) {
      values.end = moment.tz(settings.end, timezone).format(DATETIME_FORMAT);
    }

    values.timezone = timezone;

    return values;
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    // Note that timezone is not used in the runtime library; it's only stored to settings so that,
    // upon re-opening of the view, the UTC time can correctly be converted back to the selected
    // time zone and the selected time zone can be shown in the UI.
    const timezone = values.timezone || DEFAULT_TIMEZONE;

    if (values.start) {
      settings.start = moment.tz(values.start, timezone).utc().format();
    }

    if (values.end) {
      settings.end = moment.tz(values.end, timezone).utc().format();
    }

    if (timezone !== DEFAULT_TIMEZONE) {
      settings.timezone = timezone;
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.start && !values.end) {
      errors.start = 'Please specify a start or end date.';
      errors.end = errors.start;
    }

    if (timezoneOptions.indexOf(values.timezone) === -1) {
      errors.timezone = 'Please specify a valid timezone.';
    }

    return errors;
  }
};
