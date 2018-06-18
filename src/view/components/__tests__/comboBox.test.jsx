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
import { mount } from 'enzyme';
import Textfield from '@react/react-spectrum/Textfield';
import { MenuItem } from '@react/react-spectrum/Menu';
import ComboBox from '../comboBox';

const options = [
  'Apple',
  'Banana',
  'Pineapple'
];

const getReactComponents = (wrapper) => {
  wrapper.update();
  const textfield = wrapper.find(Textfield);
  const menuItems = wrapper.find(MenuItem);

  return {
    textfield,
    menuItems
  };
};

const isIE = () => {
  const myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1], 10) : false;
};

const render = () => mount(<ComboBox options={ options } />);

describe('combobox', () => {
  it('shows down chevron when selected', (done) => {
    const tree = render();
    const {
      textfield
    } = getReactComponents(tree);

    textfield.props().onFocus();
    textfield.props().onChange('ppl');


    setTimeout(() => {
      const {
        menuItems
      } = getReactComponents(tree);

      expect(menuItems.length).toBe(2);
      expect(menuItems.at(0).props().value).toBe('Apple');
      expect(menuItems.at(1).props().value).toBe('Pineapple');
      done();
    }, !isIE() || isIE() > 10 ? 0 : 50);
  });
});
