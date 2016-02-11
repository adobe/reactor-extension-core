import React from 'react';
import TestUtils from 'react-addons-test-utils';
import DisclosureButton from '../disclosureButton';

const render = props => {
  return TestUtils.renderIntoDocument(<DisclosureButton {...props}/>);
};

describe('disclosure button', () => {
  it('shows down chevron when selected', () => {
    const { icon } = render({
      selected: true
    }).refs;

    expect(icon.props.icon).toEqual('chevronDown');
  });

  it('shows right chevron when not selected', () => {
    const { icon } = render({
      selected: false
    }).refs;

    expect(icon.props.icon).toEqual('chevronRight');
  });

  it('calls onClick when clicked', () => {
    const onClick = jasmine.createSpy();
    const { button } = render({
      onClick
    }).refs;

    TestUtils.Simulate.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});
