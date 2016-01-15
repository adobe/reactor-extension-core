import React from 'react';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import ErrorIcon from '../errorIcon';

const render = props => {
  return TestUtils.renderIntoDocument(<ErrorIcon {...props}/>);
};

const getParts = instance => {
  return {
    icon: TestUtils.findRenderedComponentWithType(instance, Coral.Icon),
    tooltip: TestUtils.findRenderedComponentWithType(instance, Coral.Tooltip)
  };
};

describe('error icon', () => {
  it('creates a tooltip with a message', () => {
    const { tooltip } = getParts(render({
      message: 'foo'
    }));

    expect(tooltip.props.children).toBe('foo');
  });

  it('shows a tooltip on mouseenter, hides on mouseleave', () => {
    const { icon, tooltip } = getParts(render());

    icon.props.onMouseEnter();

    expect(tooltip.props.open).toBe(true);

    icon.props.onMouseLeave();

    expect(tooltip.props.open).toBe(false);
  });

  it('shows a tooltip when openTooltip=true', () => {
    const { tooltip } = getParts(render({
      openTooltip: true
    }));

    expect(tooltip.props.open).toBe(true);
  });

  it('does not hide a tooltip when openTooltip=true and mouse leaves icon', () => {
    const { icon, tooltip } = getParts(render({
      openTooltip: true
    }));

    expect(tooltip.props.open).toBe(true);

    icon.props.onMouseLeave();

    expect(tooltip.props.open).toBe(true);
  });
});
