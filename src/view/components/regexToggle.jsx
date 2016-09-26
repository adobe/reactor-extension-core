import React from 'react';
import classNames from 'classnames';
import Switch from '@coralui/react-coral/lib/Switch';

const fieldNameRegEx = /(.*)\[([0-9]+)\]\.(.*)/;
const getReduxFormFields = (names = [], props = {}) => names.map((name) => {
  const match = fieldNameRegEx.exec(name);
  if (match) {
    const [, fieldsProperty, index, propertyName] = match;
    return props[fieldsProperty][index][propertyName];
  }

  return props[name];
});

export default class RegexToggle extends React.Component {
  onToggleChange = event => {
    const valueIsRegexField = getReduxFormFields(this.props.names, this.props)[1];

    const {
      input: {
        onChange
      }
    } = valueIsRegexField;

    onChange(event.target.checked);
  };

  onTestRegex = () => {
    const [valueField] = getReduxFormFields(this.props.names, this.props);

    const {
      input: {
        value,
        onChange
      }
    } = valueField;

    window.extensionBridge.openRegexTester(
      value,
      onChange || (() => {})
    );
  };

  render() {
    const valueIsRegexField = getReduxFormFields(this.props.names, this.props)[1];

    const {
      input: {
        value: valueIsRegex
      }
    } = valueIsRegexField;

    return (
      <div className={ classNames(this.props.className, 'u-inlineBlock') }>
        <label>
          <Switch
            className="u-gapRight"
            checked={ valueIsRegex }
            onChange={ this.onToggleChange }
          />
          <span className="u-label">Regex</span>
          <button
            className="u-buttonReset coral-Link"
            onClick={ this.onTestRegex }
            style={ { visibility: valueIsRegex ? 'visible' : 'hidden' } }
          >Test</button>
        </label>
      </div>
    );
  }
}
