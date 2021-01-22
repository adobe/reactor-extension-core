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

/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Field } from 'redux-form';
import { Checkbox, ActionButton, Flex, Picker } from '@adobe/react-spectrum';
import { ComboBox } from '@react-spectrum/combobox';

import Data from '@spectrum-icons/workflow/Data';
import ValidationWrapper from './validationWrapper';

const addDataElementToken = (value, dataElementToken) =>
  `${value || ''}${dataElementToken}`;

class DecoratedInput extends React.Component {
  openDataElementSelector = (tokenize = false) => () => {
    const {
      input: { onChange, value }
    } = this.props;

    // Whenever we're dealing with a data element token, we add it to whatever the existing value
    // is. If we're not dealing with a token, we replace the value entirely. This is just due
    // to how we want the UX to flow.
    window.extensionBridge
      .openDataElementSelector({
        tokenize
      })
      .then((dataElement) => {
        onChange(
          tokenize ? addDataElementToken(value, dataElement) : dataElement
        );
      });
  };

  render() {
    const {
      fieldComponent: FieldComponent,
      input,
      meta,
      children,
      supportDataElement,
      supportDataElementName,
      errorTooltipPlacement,
      ...rest
    } = this.props;

    const fieldComponentsProps = {
      ...input,
      ...rest
    };

    if (meta.touched && meta.invalid) {
      fieldComponentsProps.validationState = 'invalid';
    }

    if (FieldComponent === Checkbox) {
      fieldComponentsProps.isSelected = input.value === true;
    }

    if (FieldComponent === Picker) {
      fieldComponentsProps.onSelectionChange = input.onChange;
      fieldComponentsProps.selectedKey = input.value;
    }

    if (FieldComponent === ComboBox) {
      fieldComponentsProps.onInputChange = input.onChange;
      fieldComponentsProps.onSelectionChange = input.onChange;
      fieldComponentsProps.inputValue = input.value;
    }

    return (
      <ValidationWrapper
        error={meta.touched && meta.error}
        placement={
          errorTooltipPlacement || (FieldComponent === ComboBox && 'bottom')
        }
      >
        <Flex alignItems="end">
          <FieldComponent {...fieldComponentsProps}>{children}</FieldComponent>
          {supportDataElement || supportDataElementName ? (
            <ActionButton
              aria-label="Select a data element"
              isQuiet
              onPress={this.openDataElementSelector(supportDataElement)}
            >
              <Data />
            </ActionButton>
          ) : null}
        </Flex>
      </ValidationWrapper>
    );
  }
}

export default ({ component: Component, ...rest }) => {
  const fieldProps = {
    component: DecoratedInput,
    fieldComponent: Component,
    ...rest
  };

  if (fieldProps.isRequired) {
    fieldProps.necessityIndicator = 'label';
  }

  if (Component === Checkbox) {
    // redux-form uses this to determine whether it should set the "checked" prop
    // on the actual checkbox.
    fieldProps.type = 'checkbox';
  }

  return <Field {...fieldProps} />;
};
