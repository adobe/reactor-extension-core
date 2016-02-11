import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ErrorIcon from '../errorIcon';

const render = props => {
  return TestUtils.renderIntoDocument(<ErrorIcon {...props}/>);
};

describe('error icon', () => {
  it('creates a tooltip with a message', () => {
    const { tooltip } = render({
      message: 'foo'
    }).refs;

    expect(tooltip.props.children).toBe('foo');
  });

  it('shows a tooltip on mouseenter, hides on mouseleave', () => {
    const { icon, tooltip } = render().refs;

    icon.props.onMouseEnter();

    expect(tooltip.props.open).toBe(true);

    icon.props.onMouseLeave();

    expect(tooltip.props.open).toBe(false);
  });

  it('shows a tooltip when openTooltip=true', () => {
    const { tooltip } = render({
      openTooltip: true
    }).refs;

    expect(tooltip.props.open).toBe(true);
  });

  it('does not hide a tooltip when openTooltip=true and mouse leaves icon', () => {
    const { icon, tooltip } = render({
      openTooltip: true
    }).refs;

    expect(tooltip.props.open).toBe(true);

    icon.props.onMouseLeave();

    expect(tooltip.props.open).toBe(true);
  });
});
