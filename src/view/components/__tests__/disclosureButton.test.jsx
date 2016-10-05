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
