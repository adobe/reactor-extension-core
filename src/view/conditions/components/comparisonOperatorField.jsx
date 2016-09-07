import React from 'react';
import Select from '@coralui/react-coral/lib/Select';

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
