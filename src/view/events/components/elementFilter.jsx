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
import { RadioGroup, Radio, Flex } from '@adobe/react-spectrum';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import WrappedField from '../../components/wrappedField';
import SpecificElements, {
  formConfig as specificElementsFormConfig
} from './specificElements';
import mergeFormConfigs from '../../utils/mergeFormConfigs';

const ElementFilter = ({ ...props }) => {
  const { elementSpecificity, elementSpecificityLabel } = props;

  return (
    <Flex direction="column" gap="size-100">
      {/* This second flex container is there in order to not allow the radio buttons
      to have 100% width  */}
      <Flex gap="size-100">
        <WrappedField
          name="elementSpecificity"
          component={RadioGroup}
          label={elementSpecificityLabel}
          aria-label={
            elementSpecificityLabel !== undefined
              ? elementSpecificityLabel
              : 'elements triggering the event'
          }
        >
          <Radio value="specific">specific elements</Radio>
          <Radio value="any">any element</Radio>
        </WrappedField>
      </Flex>

      {elementSpecificity === 'specific' ? <SpecificElements /> : null}
    </Flex>
  );
};

const valueSelector = formValueSelector('default');
const stateToProps = (state) => ({
  elementSpecificity: valueSelector(state, 'elementSpecificity')
});

export default connect(stateToProps)(ElementFilter);

export const formConfig = mergeFormConfigs(specificElementsFormConfig, {
  settingsToFormValues: (values, settings, state) => {
    const { elementSelector, elementProperties } = settings;

    return {
      ...values,
      elementSpecificity:
        state.meta.isNew || elementSelector || elementProperties
          ? 'specific'
          : 'any'
    };
  },
  formValuesToSettings: (settings, values) => {
    settings = {
      ...settings
    };

    const { elementSpecificity } = values;

    if (elementSpecificity === 'any') {
      delete settings.elementSelector;
      delete settings.elementProperties;
    }

    delete settings.elementSpecificity;

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    errors = specificElementsFormConfig.validate(errors, values);
    if (values.elementSpecificity !== 'specific') {
      delete errors.elementSelector;
    }

    return errors;
  }
});
