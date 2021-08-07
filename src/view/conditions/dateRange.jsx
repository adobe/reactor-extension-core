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
import Provider from '@react/react-spectrum/Provider';
import { ComboBox, Item, Flex, Text } from '@adobe/react-spectrum';
import moment from 'moment-timezone';
import Datepicker from '@react/react-spectrum/Datepicker';
import InfoTip from '../components/infoTip';
import WrappedField from '../components/wrappedField';

import './dateRange.styl';

const DEFAULT_TIMEZONE = 'GMT';
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

const timezoneOptions = moment.tz.names().map((t) => ({ id: t, name: t }));

const DateRange = () => (
  <Provider theme="lightest">
    <Flex alignItems="center" gap="size-100" wrap>
      <Flex alignItems="center" gap="size-100">
        <Text>The date and time is after</Text>
        <WrappedField name="start" component={Datepicker} type="datetime" />
        <InfoTip className="u-noPaddingRight" placement="bottom">
          Time should be specified in 24-hour time. Leaving the start date blank
          will allow the condition to pass anytime before the end date.
        </InfoTip>
      </Flex>
      <Flex alignItems="center" gap="size-100">
        <Text>and before</Text>
        <WrappedField name="end" component={Datepicker} type="datetime" />
        <InfoTip className="u-noPaddingRight" placement="bottom">
          Time should be specified in 24-hour time. Leaving the end date blank
          will allow the condition to pass anytime after the start date.
        </InfoTip>
      </Flex>
      <Flex alignItems="center" gap="size-100">
        <Text>in time zone</Text>
        <WrappedField
          aria-label="Timezone"
          name="timezone"
          component={ComboBox}
          defaultItems={timezoneOptions}
        >
          {(item) => <Item>{item.name}</Item>}
        </WrappedField>
      </Flex>
    </Flex>
  </Provider>
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
      values.start = moment
        .tz(settings.start, timezone)
        .format(DATETIME_FORMAT);
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
    settings.timezone = timezone;

    if (values.start) {
      settings.start = moment.tz(values.start, timezone).utc().format();
    }

    if (values.end) {
      settings.end = moment.tz(values.end, timezone).utc().format();
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

    if (timezoneOptions.filter((t) => t.id === values.timezone).length === 0) {
      errors.timezone = 'Please specify a valid timezone.';
    }

    return errors;
  }
};
