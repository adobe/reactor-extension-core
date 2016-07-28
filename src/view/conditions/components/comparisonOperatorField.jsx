import React from 'react';
import { ReduxFormSelect as Select } from '@reactor/react-components';

const options = [{
  label: 'greater than',
  value: '>'
}, {
  label: 'equal to',
  value: '='
}, {
  label: 'less than',
  value: '<'
}];

export default class ComparisonOperatorSelect extends React.Component {
  onChange = event => {
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  };

  render() {
    return (
      <Select
        value={ this.props.value }
        onChange={ this.onChange }
        options={ options }
      />
    );
  }
}
