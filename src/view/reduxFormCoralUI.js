import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';

// CoralUI components adapted to support simple destructuring of redux-form field props. With native
// components, redux-form field props can be applied easily using destructuring as follows:
// <input type="checkbox" {...showUnicorns}/>
// In this case, showUnicorns is an object provided by redux-form with both checked and onChange
// properties. The onChange property takes the event and grabs the value from it using
// redux-form's built-in adapter found at:
// https://github.com/erikras/redux-form/blob/1e709f87b04c64770cf557264d0b46788fdb2ccc/src/events/getValue.js
// The built-in adapter only handles React's synthetic events and events from native inputs.
// In order to appropriately adapt to CoralUI's events so that simple destructuring can be similarly
// used, we are providing the adapted components below. This process is also described here:
// http://erikras.github.io/redux-form/#/faq/custom-component?_k=1yomo8

class Checkbox extends React.Component {
  onChange = event => {
    if (this.props.onChange) {
      this.props.onChange(event.target.checked);
    }
  };

  render() {
    return <Coral.Checkbox {...this.props} onChange={this.onChange}/>;
  }
}

class Select extends React.Component {
  onChange = event => {
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  };

  onBlur = event => {
    const node = ReactDOM.findDOMNode(this);

    if (document.activeElement !== node && node.contains(document.activeElement)) {
      this.containsFocus = false;

      if (this.props.onBlur) {
        this.props.onBlur();
      }
    }
  };

  onFocus = event => {
    const node = ReactDOM.findDOMNode(this);

    if (!this.containsFocus &&
        (document.activeElement === node || node.contains(document.activeElement))) {

      this.containsFocus = true;

      if (this.props.onFocus) {
        this.props.onFocus();
      }
    }
  };

  render() {
    return (
      <Coral.Select
        {...this.props}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onFocus={this.onFocus}>
        {this.props.children}
      </Coral.Select>
    );
  }
}

Select.Item = Coral.Select.Item;

export default {
  ...Coral,
  Checkbox,
  Select
};
