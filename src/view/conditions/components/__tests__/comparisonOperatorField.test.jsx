import { mount } from 'enzyme';
import React from 'react';
import Select from '@coralui/react-coral/lib/Select';

import ComparisonOperatorField from '../comparisonOperatorField';

const getReactComponents = (wrapper) => {
  const select = wrapper.find(Select).node;

  return {
    select
  };
};

const render = props => mount(<ComparisonOperatorField { ...props } />);

describe('comparison operator field', () => {
  it('sets selected value on select', () => {
    const { select } = getReactComponents(render({
      value: '<'
    }));
    expect(select.props.value).toBe('<');
  });

  it('calls onChange with value from event', () => {
    const onChange = jasmine.createSpy();
    const { select } = getReactComponents(render({
      onChange
    }));

    select.props.onChange({
      label: 'less than',
      value: '<'
    });

    expect(onChange).toHaveBeenCalledWith('<');
  });
});
