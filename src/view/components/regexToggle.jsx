import React from 'react';
import classNames from 'classnames';
import Switch from '@coralui/react-coral/lib/Switch';
import { Field } from 'redux-form';

const TestRegexButton = props => {
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

export default props => {
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
        <span
          id="testButtonContainer"
          style={ { visibility: valueIsRegex ? 'visible' : 'hidden' } }
        >
          <Field
            name={ valueFieldName }
            component={ TestRegexButton }
          />
        </span>
      </label>
    </div>
  );
};
