import React from 'react';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import ErrorIcon from '../errorIcon';

describe('error icon', () => {
  let getParts = component => {
    return {
      icon: TestUtils.findRenderedComponentWithType(component, Coral.Icon),
      tooltip: TestUtils.findRenderedComponentWithType(component, Coral.Tooltip)
    };
  };

  let render = props => {
    return TestUtils.renderIntoDocument(<ErrorIcon { ...props }/>);
  };

  it('toggles the tooltip on property change', () => {
    let { tooltip } = getParts(render({
      openTooltip: true
    }));

    expect(tooltip.props.open).toBe(true);

    ({ tooltip } = getParts(render({
      openTooltip: false
    })));

    expect(tooltip.props.open).toBe(false);
  });

  it('toggles the tooltip on user interaction', () => {
    let { icon, tooltip } = getParts(render());

    icon.props.onMouseEnter();

    expect(tooltip.props.open).toBe(true);

    icon.props.onMouseLeave();

    expect(tooltip.props.open).toBe(false);
  });

  it('displays a message', () => {
    let component = render({
      message: 'foo'
    });

    let { tooltip } = getParts(component);

    expect(tooltip.props.children).toBe('foo');
  });
});
