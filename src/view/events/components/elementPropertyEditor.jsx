import React from 'react';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Button from '@coralui/react-coral/lib/Button';

import RegexToggle from '../../components/regexToggle';

export default class ElementPropertyEditor extends React.Component {
  remove = () => {
    this.props.remove();
  };
  render() {
    const { name, value, valueIsRegex } = this.props.fields;

    return (
      <div className="u-gapBottom">
        <ValidationWrapper
          error={ name.touched && name.error }
        >
          <Textfield
            placeholder="Property"
            onKeyPress={ this.props.onKeyPress }
            { ...name }
          />
        </ValidationWrapper>
        <span className="u-label u-gapLeft">=</span>
        <Textfield
          className="u-gapRight"
          placeholder="Value"
          onKeyPress={ this.props.onKeyPress }
          { ...value }
        />
        <RegexToggle
          value={ value.value }
          valueIsRegex={ valueIsRegex.value }
          onValueChange={ value.onChange }
          onValueIsRegexChange={ valueIsRegex.onChange }
        />
        <Button
          className="u-gapBottom"
          variant="quiet"
          icon="close"
          iconSize="S"
          onClick={ this.remove }
        />
      </div>
    );
  }
}
