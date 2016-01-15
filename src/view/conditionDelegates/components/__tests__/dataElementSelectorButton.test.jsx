import React from 'react';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import DataElementSelectorButton from '../dataElementSelectorButton';

const render = props => {
  return TestUtils.renderIntoDocument(<DataElementSelectorButton {...props}/>);
};

const getParts = instance => {
  return {
    button: TestUtils.findRenderedComponentWithType(instance, Coral.Button)
  };
};

describe('data element selector button', () => {
  it('calls handler when clicked', () => {
    const onClick = jasmine.createSpy();
    const { button } = getParts(render({
      onClick
    }));

    button.props.onClick();

    expect(onClick).toHaveBeenCalled();
  });
});
