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
import classNames from 'classnames';
import Switch from '@coralui/react-coral/lib/Switch';
import { Field } from 'redux-form';

const TestRegexButton = (props) => {
  const {
    input: {
      value,
      onChange
    }
  } = props;

  return (
    <button
      className="u-buttonReset coral-Link"
      onClick={ () => window.extensionBridge.openRegexTester(onChange, { regex: value }) }
    >
      Test
    </button>
  );
};

export default (props) => {
  const {
    input: {
      value: valueIsRegex,
      onChange
    },
    valueFieldName,
    className
  } = props;

  return (
    <div className={ classNames(className, 'u-inlineBlock') }>
      <label>
        <Switch
          className="u-gapRight"
          checked={ Boolean(valueIsRegex) }
          onChange={ event => onChange(event.target.checked) }
        />
        <span className="u-label">Regex</span>
      </label>
      <span
        id="testButtonContainer"
        style={ { visibility: valueIsRegex ? 'visible' : 'hidden' } }
      >
        <Field
          name={ valueFieldName }
          component={ TestRegexButton }
        />
      </span>
    </div>
  );
};
