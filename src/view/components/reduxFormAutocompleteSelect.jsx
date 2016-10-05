import React from 'react';

export default class ReduxFormAutocompleteSelect extends React.Component {
  onBlur = () => {
    const { onBlur, value } = this.props;
    onBlur(value);
  };

  onChange = options => {
    const { onChange, multiple } = this.props;
    if (options) {
      onChange(multiple ? options.map(option => option.value) : options.value);
    } else {
      onChange(null);
    }
  };

  render() {
    const { component: ReactCoralComponent, ...rest } = this.props;

    return (
      <ReactCoralComponent
        { ...rest }
        onBlur={ this.onBlur }
        onChange={ this.onChange }
      />
    );
  }
}
