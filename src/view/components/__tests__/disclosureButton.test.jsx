import React from 'react';
import { mount } from 'enzyme';
import DisclosureButton from '../disclosureButton';
import Icon from '@coralui/react-coral/lib/Icon';

const getReactComponents = (wrapper) => {
  const icon = wrapper.find(Icon).node;
  const button = wrapper.find('button');

  return {
    icon,
    button
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
    const { button } = getReactComponents(render({
      onClick
    }));

    button.simulate('click');

    expect(onClick).toHaveBeenCalled();
  });
});
