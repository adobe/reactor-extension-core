import React from 'react';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import ComparisonOperatorField from '../comparisonOperatorField';

const render = props => {
  return TestUtils.renderIntoDocument(<ComparisonOperatorField {...props}/>);
};

const getParts = instance => {
  return {
    select: TestUtils.findRenderedComponentWithType(instance, Coral.Select)
  };
};

describe('comparison operator field', () => {
  it('sets selected value on select', () => {
    const { select } = getParts(render({
      value: '<'
    }));
    expect(select.props.value).toBe('<');
  });
  
  it('calls onChange with value from event', () => {
    const onChange = jasmine.createSpy();
    const { select } = getParts(render({
      onChange
    }));

    select.props.onChange({
      target: {
        value: '<'
      }
    });

    expect(onChange).toHaveBeenCalledWith('<');
  })
});
