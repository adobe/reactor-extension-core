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
import classNames from 'classnames';
import Switch from '@react/react-spectrum/Switch';
import WrappedField from './wrappedField';
import RegexTestButton from './regexTestButton';

export default (props) => {
  const {
    value: valueIsRegex,
    onChange,
    valueFieldName,
    className
  } = props;

  return (
    <div className={classNames(className, 'u-inlineBlock')}>
      <Switch
        className="u-gapRight u-verticalAlignMiddle"
        checked={Boolean(valueIsRegex)}
        onChange={onChange}
        label="Regex"
      />
      <span
        id="testButtonContainer"
        style={{ visibility: valueIsRegex ? 'visible' : 'hidden' }}
      >
        <WrappedField
          name={valueFieldName}
          component={RegexTestButton}
        />
      </span>
    </div>
  );
};
