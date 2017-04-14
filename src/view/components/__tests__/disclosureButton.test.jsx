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
import Icon from '@coralui/react-coral/lib/Icon';
import DisclosureButton from '../disclosureButton';

const getReactComponents = (wrapper) => {
  const icon = wrapper.find(Icon).node;
  const buttonWrapper = wrapper.find('button');

  return {
    icon,
    buttonWrapper
  };
};

const render = props => mount(<DisclosureButton { ...props } />);

describe('disclosure button', () => {
  it('shows down chevron when selected', () => {
    const { icon } = getReactComponents(render({
      selected: true
    }));

    expect(icon.props.icon).toEqual('chevronDown');
  });

  it('shows right chevron when not selected', () => {
    const { icon } = getReactComponents(render({
      selected: false
    }));

    expect(icon.props.icon).toEqual('chevronRight');
  });

  it('calls onClick when clicked', () => {
    const onClick = jasmine.createSpy();
    const { buttonWrapper } = getReactComponents(render({
      onClick
    }));

    buttonWrapper.simulate('click');

    expect(onClick).toHaveBeenCalled();
  });
});
