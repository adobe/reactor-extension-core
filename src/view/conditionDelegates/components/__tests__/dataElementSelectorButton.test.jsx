import React from 'react';
import TestUtils from 'react-addons-test-utils';

import DataElementSelectorButton from '../dataElementSelectorButton';

const render = props => {
  return TestUtils.renderIntoDocument(<DataElementSelectorButton {...props}/>);
};

describe('data element selector button', () => {
  it('calls handler when clicked', () => {
    const onClick = jasmine.createSpy();
    const { button } = render({
      onClick
    }).refs;

    button.props.onClick();

    expect(onClick).toHaveBeenCalled();
  });
});
