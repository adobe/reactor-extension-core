import React from 'react';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import ComparisonOperatorField from '../comparisonOperatorField';

const getParts = instance => {
  return {
    select: TestUtils.findRenderedComponentWithType(instance, Coral.Select)
  };
};

describe('comparison operator field', () => {
  it('sets selected value on select', () => {
    const instance = TestUtils.renderIntoDocument(<ComparisonOperatorField value="<"/>);
    const { select } = getParts(instance);
    expect(select.props.value).toBe('<');
  });
  
  it('calls onChange with value from event', () => {
    const onChange = jasmine.createSpy();
    const instance = TestUtils.renderIntoDocument(<ComparisonOperatorField onChange={onChange}/>);
    const { select } = getParts(instance);

    select.props.onChange({
      target: {
        value: '<'
      }
    });

    expect(onChange).toHaveBeenCalledWith('<');
  })
});
