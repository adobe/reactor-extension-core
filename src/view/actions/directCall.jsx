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
import { isPlainObject } from 'is-plain-object';
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
                {String.fromCharCode(FORWARD_SLASH)}&nbsp; enhances the direct
                this information
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
              >
                <WrappedField
                  name={`${detailRow}.key`}
                  type="text"
                  component={TextField}
                  placeholder="key"
                  supportDataElement
                  isRequired
                />
                <span className="codeText">{String.fromCharCode(COLON)}</span>
                <WrappedField
                  name={`${detailRow}.value`}
                  type="text"
                  component={TextField}
                  placeholder="value"
                  supportDataElement
                  isRequired
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
      <ActionButton marginTop="size-200" onPress={() => fields.push({})}>
        Add Field
      </ActionButton>
    </>
  );
};

const filterEmptySimpleViewRows = (detailObjectEntries) => {
  const sanitized = {};
  if (!detailObjectEntries?.length) {
    return sanitized;
  }

  return detailObjectEntries.reduce((entries, nextRow) => {
    const { key, value } = nextRow;
    if (key?.length && value?.length) {
      return {
        ...entries,
        [key]: value
      };
    }
    return entries;
  }, sanitized);
};

const DirectCall = () => (
  <div className="directCall">
    <FullWidthField
      label="Direct Call Identifier"
      name="identifier"
      containerMinWidth={containerMinWidth}
      isRequired
    />

    <FieldArray component={DetailObjectRows} name="detailObjectEntries" />
  </div>
);

export default DirectCall;

export const formConfig = {
  settingsToFormValues(values, settings) {
    const detailObject = isPlainObject(settings.detail) ? settings.detail : {};

    const settingsObjectEntries = Object.entries(detailObject);

    if (settingsObjectEntries.length) {
      return {
        ...settings,
        detailObjectEntries: settingsObjectEntries.map(([key, value]) => ({
          key,
          value
        }))
      };
    }

    return {
      ...settings,
      detailObjectEntries: [{}]
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      identifier: values.identifier,
      detail: filterEmptySimpleViewRows(values.detailObjectEntries)
    };
  },
  validate(errors, values) {
    errors = { ...errors };

    if (!values.identifier) {
      errors.identifier = 'Please specify an identifier.';
    }

    errors.detailObjectEntries = [];
    values.detailObjectEntries?.forEach((row, index) => {
      errors.detailObjectEntries[index] = {};
      const isRowEmpty = !row.key?.length && !row.value?.length;
      if (!isRowEmpty) {
        if (!row.key?.length) {
          errors.detailObjectEntries[index].key = 'This is required';
        } else if (!row?.value?.length) {
          errors.detailObjectEntries[index].value = 'This is required';
        }
      }
    });

    return errors;
  }
};
