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
import { Flex, TextField, View, Link } from '@adobe/react-spectrum';

import WrappedField from '../components/wrappedField';
import InfoTip from '../components/infoTip';

import AdvancedEventOptions, {
  formConfig as advancedEventOptionsFormConfig
} from './components/advancedEventOptions';
import ElementFilter, {
  formConfig as elementFilterFormConfig
} from './components/elementFilter';
import mergeFormConfigs from '../utils/mergeFormConfigs';

const CustomEvent = () => (
  <Flex gap="size-100" direction="column">
    <Flex alignItems="end" gap="size-100">
      <View flex>
        <WrappedField
          name="type"
          width="100%"
          label="Custom Event Type"
          isRequired
          component={TextField}
        />
      </View>
      <InfoTip placement="bottom">
        This is the name of the event that will be triggered.
      </InfoTip>
      <View marginBottom="size-75">
        <Link>
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more
          </a>
        </Link>
      </View>
      <View width="size-600" />
    </Flex>

    <ElementFilter />

    <AdvancedEventOptions />
  </Flex>
);

export default CustomEvent;

export const formConfig = mergeFormConfigs(
  elementFilterFormConfig,
  advancedEventOptionsFormConfig,
  {
    settingsToFormValues: (values, settings) => ({
      ...values,
      type: settings.type
    }),
    formValuesToSettings: (settings, values) => ({
      ...settings,
      type: values.type
    }),
    validate: (errors, values) => {
      errors = {
        ...errors
      };

      if (!values.type) {
        errors.type = 'Please specify a custom event type.';
      }

      return errors;
    }
  }
);
