import React from 'react';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import DisclosureButton from '../disclosureButton';

const render = props => {
  return TestUtils.renderIntoDocument(<DisclosureButton {...props}/>);
};

const getParts = instance => {
  return {
    button: TestUtils.findRenderedDOMComponentWithTag(instance, 'button'),
    icon: TestUtils.findRenderedComponentWithType(instance, Coral.Icon)
  };
};

describe('disclosure button', () => {
  it('shows down chevron when selected', () => {
    const { icon } = getParts(render({
      selected: true
    }));

    expect(icon.props.icon).toEqual('chevronDown');
  });

  it('shows right chevron when not selected', () => {
    const { icon } = getParts(render({
      selected: false
    }));

    expect(icon.props.icon).toEqual('chevronRight');
  });

  it('calls onClick when clicked', () => {
    const onClick = jasmine.createSpy();
    const { button } = getParts(render({
      onClick
    }));

    TestUtils.Simulate.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});
