import React from 'react';
import Coral from 'coralui-support-react';

export default class ComparisonOperatorSelect extends React.Component {
  onChange = event => {
    this.props.onChange(event.target.value);
  };

  render() {
    return (
      <Coral.Select value={this.props.value} onChange={this.onChange}>
        <Coral.Select.Item value=">">greater than</Coral.Select.Item>
        <Coral.Select.Item value="=">equal to</Coral.Select.Item>
        <Coral.Select.Item value="<">less than</Coral.Select.Item>
      </Coral.Select>
    );
  }
}
