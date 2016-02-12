import React from 'react';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import ComparisonOperatorField from '../comparisonOperatorField';

const render = props => {
  return TestUtils.renderIntoDocument(<ComparisonOperatorField {...props}/>);
};

describe('comparison operator field', () => {
  it('sets selected value on select', () => {
    const { select } = render({
      value: '<'
    }).refs;
    expect(select.props.value).toBe('<');
  });
  
  it('calls onChange with value from event', () => {
    const onChange = jasmine.createSpy();
    const { select } = render({
      onChange
    }).refs;

    select.props.onChange({
      target: {
        value: '<'
      }
    });

    expect(onChange).toHaveBeenCalledWith('<');
  });
});
