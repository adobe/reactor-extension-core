import React from 'react';
import TestUtils from 'react-addons-test-utils';
import DisclosureButton from '../disclosureButton';
import Coral from 'coralui-support-react';

describe('disclosure button', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(<DisclosureButton {...props} />);
  };

  let getParts = component => {
    return {
      icon: TestUtils.findRenderedComponentWithType(component, Coral.Icon),
      button: TestUtils.findRenderedDOMComponentWithTag(component, 'button')
    };
  };

  it('shows a down chevron when selected', () => {
    let { icon } = getParts(render({
      selected: true
    }));

    expect(icon.props.icon).toBe('chevronDown');
  });

  it('shows a right chevron when not selected', () => {
    let { icon } = getParts(render());

    expect(icon.props.icon).toBe('chevronRight');
  });

  it('calls setSelected(true) when clicked and is currently not selected', () => {
    let setSelected = jasmine.createSpy();

    let { button } = getParts(render({
      setSelected
    }));

    TestUtils.Simulate.click(button);
    expect(setSelected).toHaveBeenCalledWith(true);
  });

  it('calls setSelected(false) when clicked and is currently selected', () => {
    let setSelected = jasmine.createSpy();

    let { button } = getParts(render({
      selected: true,
      setSelected
    }));

    TestUtils.Simulate.click(button);
    expect(setSelected).toHaveBeenCalledWith(false);
  });
});
