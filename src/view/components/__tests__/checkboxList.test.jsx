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

import { mount } from 'enzyme';
import React from 'react';
import Checkbox from '@react/react-spectrum/Checkbox';
import CheckboxList from '../checkboxList';

const render = props => mount(<CheckboxList { ...props } />);

const getReactComponents = (wrapper) => {
  wrapper.update();
  return {
    checkboxes: wrapper.find(Checkbox)
  };
};

const stringOptions = [
  'a',
  'b',
  'c'
];

const objectOptions = [
  {
    value: 'a',
    label: 'A'
  },
  {
    value: 'b',
    label: 'B'
  },
  {
    value: 'c',
    label: 'C'
  }
];

describe('checkbox list', () => {
  it('creates checkboxes from string options', () => {
    const { checkboxes } = getReactComponents(render({
      options: stringOptions
    }));

    const renderedValues = checkboxes.map(checkbox => checkbox.props().value);
    const renderedLabels = checkboxes.map(checkbox => checkbox.props().label);

    expect(renderedValues).toEqual(stringOptions);
    expect(renderedLabels).toEqual(stringOptions);
  });

  it('creates checkboxes from object options', () => {
    const { checkboxes } = getReactComponents(render({
      options: objectOptions
    }));

    const renderedValues = checkboxes.map(checkbox => checkbox.props().value);
    const renderedLabels = checkboxes.map(checkbox => checkbox.props().label);

    expect(renderedValues).toEqual(['a', 'b', 'c']);
    expect(renderedLabels).toEqual(['A', 'B', 'C']);
  });

  it('checks checkboxes based on value', () => {
    const { checkboxes } = getReactComponents(render({
      options: stringOptions,
      value: ['b']
    }));

    expect(checkboxes.at(1).props().checked).toBe(true);
  });

  it('calls onChange when a checkbox is checked', () => {
    const onChange = jasmine.createSpy();
    const { checkboxes } = getReactComponents(render({
      options: stringOptions,
      value: ['b'],
      onChange
    }));

    const testCheckbox = checkboxes.at(2);

    testCheckbox.props().onChange(
      true,
      {
        nativeEvent: {
          target: {
            value: testCheckbox.props().value,
            checked: true
          }
        }
      }
    );

    expect(onChange).toHaveBeenCalledWith(['b', 'c']);
  });

  it('calls onChange when a checkbox is unchecked', () => {
    const onChange = jasmine.createSpy();
    const { checkboxes } = getReactComponents(render({
      options: stringOptions,
      value: ['b', 'c'],
      onChange
    }));

    const testCheckbox = checkboxes.at(2);

    testCheckbox.props().onChange(
      false,
      {
        nativeEvent: {
          target: {
            value: testCheckbox.props().value,
            checked: false
          }
        }
      }
    );

    expect(onChange).toHaveBeenCalledWith(['b']);
  });
});
