import React from 'react';
import { mount } from 'enzyme';
import ElementPropertyEditor from '../../components/elementPropertyEditor';
import RegexToggle from '../../../components/regexToggle';
import { ValidationWrapper } from '@reactor/react-components';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';


const render = props => mount(<ElementPropertyEditor { ...props } />);

let mockProps;

const getReactComponents = (wrapper) => {
  const nameField = wrapper.find(Textfield).nodes[0];
  const valueField = wrapper.find(Textfield).nodes[1];
  const nameValidationWrapper = wrapper.find(ValidationWrapper).node;
  const regexToggle = wrapper.find(RegexToggle).node;
  const removeButton = wrapper.find(Button).node;

  return {
    nameField,
    valueField,
    nameValidationWrapper,
    regexToggle,
    removeButton
  };
};

describe('elementPropertyEditor', () => {
  beforeEach(() => {
    mockProps = {
      fields: {
        name: {
          value: 'foo',
          onChange: jasmine.createSpy()
        },
        value: {
          value: 'bar',
          onChange: jasmine.createSpy()
        },
        valueIsRegex: {
          value: true,
          onChange: jasmine.createSpy()
        }
      },
      remove: jasmine.createSpy()
    };
  });

  describe('name field', () => {
    it('receives value', () => {
      const { nameField } = getReactComponents(render(mockProps));

      expect(nameField.props.value).toBe('foo');
    });

    it('calls onChange', () => {
      const { nameField } = getReactComponents(render(mockProps));

      nameField.props.onChange('foo');
      expect(mockProps.fields.name.onChange).toHaveBeenCalledWith('foo');
    });
  });

  describe('name validation wrapper', () => {
    it('receives error', () => {
      mockProps.fields.name.touched = true;
      mockProps.fields.name.error = 'Test error.';
      const { nameValidationWrapper } = getReactComponents(render(mockProps));

      expect(nameValidationWrapper.props.error).toEqual(jasmine.any(String));
    });
  });

  describe('value field', () => {
    it('receives value', () => {
      const { valueField } = getReactComponents(render(mockProps));

      expect(valueField.props.value).toBe('bar');
    });

    it('calls onChange', () => {
      const { valueField } = getReactComponents(render(mockProps));

      valueField.props.onChange('bar');
      expect(mockProps.fields.value.onChange).toHaveBeenCalledWith('bar');
    });
  });

  describe('regex toggle', () => {
    it('receives value', () => {
      const { regexToggle } = getReactComponents(render(mockProps));

      expect(regexToggle.props.value).toBe('bar');
    });


    it('calls value.onChange', () => {
      const { regexToggle } = getReactComponents(render(mockProps));

      regexToggle.props.onValueChange('bar');
      expect(mockProps.fields.value.onChange).toHaveBeenCalledWith('bar');
    });

    it('receives valueIsRegex', () => {
      const { regexToggle } = getReactComponents(render(mockProps));

      expect(regexToggle.props.valueIsRegex).toBe(true);
    });

    it('calls valueIsRegex.onChange', () => {
      const { regexToggle } = getReactComponents(render(mockProps));

      regexToggle.props.onValueIsRegexChange(false);
      expect(mockProps.fields.valueIsRegex.onChange).toHaveBeenCalledWith(false);
    });
  });

  describe('remove button', () => {
    it('is shown by default', () => {
      const { removeButton } = getReactComponents(render(mockProps));

      expect(removeButton).toBeDefined();
    });

    it('calls remove property when clicked', () => {
      const { removeButton } = getReactComponents(render(mockProps));

      removeButton.props.onClick();

      expect(mockProps.remove).toHaveBeenCalled();
    });
  });
});
