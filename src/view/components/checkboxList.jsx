import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

export default class CheckboxList extends React.Component {
  onChange = event => {
    const checkboxValue = event.target.value;
    const value = this.props.value ? this.props.value.slice() : [];

    if (event.target.checked) {
      value.push(checkboxValue);
    } else {
      const index = value.indexOf(checkboxValue);
      value.splice(index, 1);
    }

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  render() {
    let options = this.props.options || [];
    options = options.map(option => {
      let value;
      let label;

      if (typeof option === 'string') {
        value = option;
        label = option;
      } else {
        value = option.value;
        label = option.label;
      }

      return (
        <li key={ value }>
          <Checkbox
            value={ value }
            checked={ this.props.value && this.props.value.indexOf(value) > -1 }
            onChange={ this.onChange }
          >
            { label }
          </Checkbox>
        </li>
      );
    });

    return (
      <ul className="CheckboxList">
        { options }
      </ul>
    );
  }
}
