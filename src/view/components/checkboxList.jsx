import React from 'react';
import Coral from 'coralui-support-react';

export default class CheckboxList extends React.Component {
  onChange = event => {
    let value = event.target.value;
    let selectedValues = this.props.selectedValues || [];
    let index = selectedValues.indexOf(value);

    if (event.target.checked) {
      if (index === -1) {
        this.props.select(value);
      }
    } else {
      if (index !== -1) {
        this.props.deselect(value);
      }
    }
  };

  render() {
    let items = this.props.items || [];
    let selectedValues = this.props.selectedValues || [];

    let options = items.map(item => {
      let value;
      let label;

      if (typeof item === 'string') {
        value = item;
        label = item;
      } else {
        value = item.value;
        label = item.label;
      }

      return (
        <li key={value}>
          <Coral.Checkbox
            value={value}
            checked={selectedValues.indexOf(value) !== -1}
            onChange={this.onChange}>
            {label}
          </Coral.Checkbox>
        </li>
      );
    });

    return (
      <ul className="CheckboxList">
        {options}
      </ul>
    );
  }
}
