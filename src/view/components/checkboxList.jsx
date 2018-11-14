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
    const { onChange } = this.props;
    let { value = [] } = this.props;
    value = value.slice();

    if (isChecked) {
      value.push(checkboxValue);
    } else {
      const index = value.indexOf(checkboxValue);
      value.splice(index, 1);
    }

    onChange(value);
  };

  render() {
    let { options = [], value } = this.props;
    options = options.map((option) => {
      let optionValue;
      let optionLabel;

      if (typeof option === 'string') {
        optionValue = option;
        optionLabel = option;
      } else {
        optionValue = option.value;
        optionLabel = option.label;
      }

      return (
        <li key={optionValue}>
          <Checkbox
            value={optionValue}
            checked={value && value.indexOf(optionValue) > -1}
            onChange={this.onChange}
            label={optionLabel}
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
