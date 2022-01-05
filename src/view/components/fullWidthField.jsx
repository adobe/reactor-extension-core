/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from 'react';
import { View, Flex, TextField } from '@adobe/react-spectrum';
import WrappedField from './wrappedField';
import RegexToggle from './regexToggle';
import NoWrapText from './noWrapText';

export const DEFAULT_BLANK_SPACE_PROPS = {
  width: 'size-1600'
};

export default React.forwardRef(
  (
    {
      component = TextField,
      blankSpace = DEFAULT_BLANK_SPACE_PROPS,
      beginText,
      regexName,
      regexValueFieldName,
      containerMinWidth,
      children,
      ...rest
    },
    ref
  ) => (
    <Flex alignItems="end" gap="size-100" minWidth={containerMinWidth}>
      {beginText && <NoWrapText>{beginText}</NoWrapText>}
      <View flex>
        <WrappedField width="100%" component={component} {...rest}>
          {children}
        </WrappedField>
      </View>
      {regexName && regexValueFieldName && (
        <WrappedField
          name={regexName}
          component={RegexToggle}
          valueFieldName={regexValueFieldName}
          ref={ref}
        />
      )}
      {blankSpace && <View {...blankSpace} />}
    </Flex>
  )
);
