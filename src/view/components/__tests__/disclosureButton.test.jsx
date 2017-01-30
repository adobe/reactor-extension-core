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
