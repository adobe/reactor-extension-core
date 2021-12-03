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
import {
  ActionButton,
  TextField,
  Flex,
  Well,
  View
} from '@adobe/react-spectrum';
import CloseIcon from '@spectrum-icons/workflow/Close';
import { FieldArray } from 'redux-form';
import FullWidthField, {
  DEFAULT_BLANK_SPACE_PROPS
} from '../components/fullWidthField';
import WrappedField from '../components/wrappedField';
import './directCall.styl';

const FORWARD_SLASH = 0x2215;
const OPENING_CURLY = 0x007b;
const CLOSING_CURLY = 0x007d;
const COLON = 0x003a;
const SEMICOLON = 0x003b;

const containerMinWidth = 'size-6000';

const DetailObjectRows = ({ fields }) => {
  return (
    <>
      {/* Matches the structure inside FullWidthField */}
      <Flex alignItems="end" gap="size-100" minWidth={containerMinWidth}>
        <View flex>
          <Well marginTop="size-200">
            <span className="codeLine">
              <em>
                {String.fromCharCode(FORWARD_SLASH)}&nbsp;
                {String.fromCharCode(FORWARD_SLASH)}&nbsp; (optional) - enhance
                the direct call with this information
              </em>
            </span>
            <span className="codeLine">
              const detail = {String.fromCharCode(OPENING_CURLY)}
            </span>
            {fields.map((detailRow, index) => (
              <Flex
                key={detailRow}
                gap="size-100"
                width="100%"
                margin="size-200"
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
                <ActionButton
                  aria-label="Delete"
                  isQuiet
                  onPress={() => {
                    fields.remove(index);
                    if (fields.length === 1) {
                      fields.push({});
                    }
                  }}
                >
                  <CloseIcon size="XS" />
                </ActionButton>
              </Flex>
            ))}
            <span className="codeLine">
              {String.fromCharCode(CLOSING_CURLY)}
              {String.fromCharCode(SEMICOLON)}
            </span>
            <span className="codeLine">
              return detail{String.fromCharCode(SEMICOLON)}
            </span>
          </Well>
        </View>
        <View {...DEFAULT_BLANK_SPACE_PROPS} />
      </Flex>
      <ActionButton
        marginTop="size-200"
        onPress={() => fields.push({})}
        aria-label="Add detail field"
      >
        Add Detail Field
      </ActionButton>
    </>
  );
};

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

    <FieldArray component={DetailObjectRows} name="eventObjectEntries" />
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
        } else if (!row?.value?.length) {
          // value supports undefined/null if that's what a dataElement would reduce to,
          // but we require on this form that either a string value is given or
          // the name of a dataElement.
          errors.eventObjectEntries[index].value = 'This is required';
        }
      }
    });

    return errors;
  }
};
