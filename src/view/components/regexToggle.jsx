/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

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
      onClick={ () => window.extensionBridge.openRegexTester(value, onChange) }
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
