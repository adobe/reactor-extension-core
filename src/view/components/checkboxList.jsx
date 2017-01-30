/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

export default class CheckboxList extends React.Component {
  onChange = (event) => {
    const checkboxValue = event.target.value;
    const value = this.props.input.value ? this.props.input.value.slice() : [];

    if (event.target.checked) {
      value.push(checkboxValue);
    } else {
      const index = value.indexOf(checkboxValue);
      value.splice(index, 1);
    }

    this.props.input.onChange(value);
  };

  render() {
    let options = this.props.options || [];
    options = options.map((option) => {
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
            checked={
              this.props.input &&
              this.props.input.value &&
              this.props.input.value.indexOf(value) > -1
            }
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
