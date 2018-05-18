/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import React from 'react';
import Checkbox from '@react/react-spectrum/Checkbox';

import './checkboxList.styl';

export default class CheckboxList extends React.Component {
  onChange = (isChecked, event) => {
    const checkboxValue = event.nativeEvent.target.value;
    const value = this.props.value ? this.props.value.slice() : [];

    if (isChecked) {
      value.push(checkboxValue);
    } else {
      const index = value.indexOf(checkboxValue);
      value.splice(index, 1);
    }

    this.props.onChange(value);
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
              this.props.value &&
              this.props.value.indexOf(value) > -1
            }
            onChange={ this.onChange }
            label={ label }
          />
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
