import { mount } from 'enzyme';
import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

import CheckboxList from '../checkboxList';

const render = props => mount(<CheckboxList { ...props } />);

const getParts = wrapper => ({
  checkboxes: wrapper.find(Checkbox).nodes
});

const stringOptions = [
  'a',
  'b',
  'c'
];

const objectOptions = [
  {
    value: 'a',
    label: 'A'
  },
  {
    value: 'b',
    label: 'B'
  },
  {
    value: 'c',
    label: 'C'
  }
];

describe('checkbox list', () => {
  it('creates checkboxes from string options', () => {
    const { checkboxes } = getParts(render({
      options: stringOptions
    }));

    const renderedValues = checkboxes.map(checkbox => checkbox.props.value);
    const renderedLabels = checkboxes.map(checkbox => checkbox.props.children);

    expect(renderedValues).toEqual(stringOptions);
    expect(renderedLabels).toEqual(stringOptions);
  });

  it('creates checkboxes from object options', () => {
    const { checkboxes } = getParts(render({
      options: objectOptions
    }));

    const renderedValues = checkboxes.map(checkbox => checkbox.props.value);
    const renderedLabels = checkboxes.map(checkbox => checkbox.props.children);

    expect(renderedValues).toEqual(['a', 'b', 'c']);
    expect(renderedLabels).toEqual(['A', 'B', 'C']);
  });

  it('checks checkboxes based on value', () => {
    const { checkboxes } = getParts(render({
      options: stringOptions,
      value: ['b']
    }));

    expect(checkboxes[1].props.checked).toBe(true);
  });

  it('calls onChange when a checkbox is checked', () => {
    const onChange = jasmine.createSpy();
    const { checkboxes } = getParts(render({
      options: stringOptions,
      value: ['b'],
      onChange
    }));

    const testCheckbox = checkboxes[2];

    testCheckbox.props.onChange({
      target: {
        value: testCheckbox.props.value,
        checked: true
      }
    });

    expect(onChange).toHaveBeenCalledWith(['b', 'c']);
  });

  it('calls onChange when a checkbox is unchecked', () => {
    const onChange = jasmine.createSpy();
    const { checkboxes } = getParts(render({
      options: stringOptions,
      value: ['b', 'c'],
      onChange
    }));

    const testCheckbox = checkboxes[2];

    testCheckbox.props.onChange({
      target: {
        value: testCheckbox.props.value,
        checked: false
      }
    });

    expect(onChange).toHaveBeenCalledWith(['b']);
  });
});
