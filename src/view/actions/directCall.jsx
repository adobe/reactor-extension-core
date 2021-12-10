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
import { TextField, Flex } from '@adobe/react-spectrum';
import { FieldArray } from 'redux-form';
import FullWidthField from '../components/fullWidthField';
import WrappedField from '../components/wrappedField';
import SpectrumLabel from '../components/spectrumLabel';
import InfoTip from '../components/infoTip';
import MultipleItemEditor from '../components/multipleItemEditor';
import './directCall.styl';

const OPENING_CURLY = 0x007b;
const CLOSING_CURLY = 0x007d;
const COLON = 0x003a;
const SEMICOLON = 0x003b;

const containerMinWidth = 'size-6000';

const renderItem = (detailRow) => (
  <Flex
    UNSAFE_className="directCallMultipleItemEditor-body"
    gap="size-100"
    alignItems="center"
    data-test-detail-row
  >
    <WrappedField
      aria-label="Key"
      name={`${detailRow}.key`}
      type="text"
      component={TextField}
      placeholder="key"
      isRequired
      data-test-row-key
    />
    <span className="codeText">{String.fromCharCode(COLON)}</span>
    <WrappedField
      aria-label="Value"
      name={`${detailRow}.value`}
      type="text"
      component={TextField}
      placeholder="value"
      supportDataElement
      isRequired
      data-test-row-value
    />
  </Flex>
);

const filterEmptyDetailObjectRows = (detailObjectsArray) => {
  if (!detailObjectsArray?.length) {
    return detailObjectsArray;
  }

  return detailObjectsArray.reduce((entries, nextRow) => {
    const { key, value } = nextRow;
    if (nextRow.key?.length && nextRow.value?.length) {
      return entries.concat({ key, value });
    }
    return entries;
  }, []);
};

const DirectCall = () => (
  <div className="directCall">
    <FullWidthField
      label="Direct Call Identifier"
      name="identifier"
      containerMinWidth={containerMinWidth}
      isRequired
    />

    <Flex marginTop="size-200" alignItems="center">
      <SpectrumLabel>Event Detail (optional)</SpectrumLabel>
      <InfoTip>
        This detail object will be passed on to any Rule listening for the
        direct call identifier above.
      </InfoTip>
    </Flex>
    <span className="codeLine mb10">
      const detail = {String.fromCharCode(OPENING_CURLY)}
    </span>
    <FieldArray
      name="eventObjectEntries"
      renderItem={renderItem}
      component={MultipleItemEditor}
      createItem={() => {
        return {};
      }}
      className="directCallMultipleItemEditor-footer"
    />
    <span className="codeLine mt10">
      {String.fromCharCode(CLOSING_CURLY)}
      {String.fromCharCode(SEMICOLON)}
    </span>
    <span className="codeLine">
      return detail{String.fromCharCode(SEMICOLON)}
    </span>
  </div>
);

export default DirectCall;

export const formConfig = {
  settingsToFormValues(values, settings) {
    let eventObjectEntries;
    if (Array.isArray(settings.detail?.eventObjectEntries)) {
      eventObjectEntries = settings.detail.eventObjectEntries;
    } else {
      eventObjectEntries = [{}];
    }

    return {
      ...settings,
      eventObjectEntries
    };
  },
  formValuesToSettings(settings, values) {
    const eventObjectEntries = filterEmptyDetailObjectRows(
      values.eventObjectEntries
    );

    const newSettings = {
      ...settings,
      identifier: values.identifier
    };
    if (eventObjectEntries.length) {
      newSettings.detail = {
        eventObjectEntries
      };
    }

    return newSettings;
  },
  validate(errors, values) {
    errors = { ...errors };

    const keyNamesToCount = values?.eventObjectEntries?.reduce(
      (obj, { key }) => {
        if (key?.length) {
          let newCount = 1;
          if (obj.hasOwnProperty(key)) {
            newCount = obj[key] + 1;
          }
          return {
            ...obj,
            [key]: newCount
          };
        }
        return obj;
      },
      {}
    );

    if (!values.identifier) {
      errors.identifier = 'Please specify an identifier.';
    }

    errors.eventObjectEntries = [];
    values.eventObjectEntries?.forEach((row, index) => {
      errors.eventObjectEntries[index] = {};
      const isRowEmpty = !row.key?.length && !row.value?.length;
      if (!isRowEmpty) {
        if (!row.key?.length) {
          errors.eventObjectEntries[index].key = 'This is required';
        } else if (keyNamesToCount[row.key] > 1) {
          errors.eventObjectEntries[index].key = 'This key is repeated';
        }
      }
    });

    return errors;
  }
};
