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
import Datepicker from '@coralui/redux-form-react-coral/lib/Datepicker';
import Autocomplete from '@coralui/redux-form-react-coral/lib/Autocomplete';
import moment from 'moment-timezone';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import InfoTip from '@reactor/react-components/lib/infoTip';

import './dateRange.styl';

const DEFAULT_TIMEZONE = 'GMT';
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

const getTimezoneOptions = (() => {
  // Cache so we're not calculating options on every render.
  let timezoneOptions;
  return () => {
    timezoneOptions = timezoneOptions ||
      moment.tz.names().map(name => ({ value: name, label: name }));
    return timezoneOptions;
  };
})();

const DateRange = () => (
  <div>
    <label className="u-gapRight u-gapBottom u-noWrap u-floatLeft">
      <span className="u-label">The date and time is after </span>
      <Field
        name="start"
        component={ DecoratedInput }
        inputComponent={ Datepicker }
        inputClassName="DateRange-datePicker"
        type="datetime"
      />
      <InfoTip className="u-noPaddingRight" placement="bottom">
        Leaving the start date blank will allow the condition to pass anytime before the end date.
      </InfoTip>
    </label>
    <label className="u-gapRight u-gapBottom u-noWrap u-floatLeft">
      <span className="u-label">and before</span>
      <Field
        name="end"
        component={ DecoratedInput }
        inputComponent={ Datepicker }
        inputClassName="DateRange-datePicker"
        type="datetime"
      />
      <InfoTip className="u-noPaddingRight" placement="bottom">
        Leaving the end date blank will allow the condition to pass anytime before the start date.
      </InfoTip>
    </label>
    <label className="u-gapRight u-gapBottom u-noWrap u-floatLeft">
      <span className="u-label">in time zone</span>
      <Field
        name="timezone"
        component={ DecoratedInput }
        inputComponent={ Autocomplete }
        options={ getTimezoneOptions() }
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

    let timezone = settings.timezone;

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
      errors.start = errors.end = 'Please specify a start or end date.';
    }

    return errors;
  }
};
