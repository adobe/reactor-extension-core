import { mount } from 'enzyme';
import React from 'react';
import ComparisonOperatorField from '../comparisonOperatorField';
import { ReduxFormSelect as Select } from '@reactor/react-components';

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
      target: {
        value: '<'
      }
    });

    expect(onChange).toHaveBeenCalledWith('<');
  });
});
