import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper } from '@reactor/react-components';
import ElementPropertyEditor from '../../components/elementPropertyEditor';

const render = props => {
  return TestUtils.renderIntoDocument(<ElementPropertyEditor {...props}/>);
};

var mockProps;

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
      const { nameField } = render(mockProps).refs;

      expect(nameField.props.value).toBe('foo');
    });

    it('calls onChange', () => {
      const { nameField } = render(mockProps).refs;

      nameField.props.onChange('foo');
      expect(mockProps.fields.name.onChange).toHaveBeenCalledWith('foo');
    });
  });

  describe('name validation wrapper', () => {
    it('receives error', () => {
      mockProps.fields.name.touched = true;
      mockProps.fields.name.error = 'Test error.';
      const { nameValidationWrapper } = render(mockProps).refs;

      expect(nameValidationWrapper.props.error).toEqual(jasmine.any(String));
    });
  });

  describe('value field', () => {
    it('receives value', () => {
      const { valueField } = render(mockProps).refs;

      expect(valueField.props.value).toBe('bar');
    });

    it('calls onChange', () => {
      const { valueField } = render(mockProps).refs;

      valueField.props.onChange('bar');
      expect(mockProps.fields.value.onChange).toHaveBeenCalledWith('bar');
    });
  });

  describe('regex toggle', () => {
    it('receives value', () => {
      const { regexToggle } = render(mockProps).refs;

      expect(regexToggle.props.value).toBe('bar');
    });


    it('calls value.onChange', () => {
      const { regexToggle } = render(mockProps).refs;

      regexToggle.props.onValueChange('bar');
      expect(mockProps.fields.value.onChange).toHaveBeenCalledWith('bar');
    });

    it('receives valueIsRegex', () => {
      const { regexToggle } = render(mockProps).refs;

      expect(regexToggle.props.valueIsRegex).toBe(true);
    });

    it('calls valueIsRegex.onChange', () => {
      const { regexToggle } = render(mockProps).refs;

      regexToggle.props.onValueIsRegexChange(false);
      expect(mockProps.fields.valueIsRegex.onChange).toHaveBeenCalledWith(false);
    });
  });

  describe('remove button', () => {
    it('is shown when removable=true', () => {
      mockProps.removable = true;

      const { removeButton } = render(mockProps).refs;

      expect(removeButton).toBeDefined();
    });

    it('is not shown when removable=false', () => {
      const { removeButton } = render(mockProps).refs;

      expect(removeButton).toBeUndefined();
    });

    it('calls remove property when clicked', () => {
      mockProps.removable = true;

      const { removeButton } = render(mockProps).refs;

      removeButton.props.onClick();

      expect(mockProps.remove).toHaveBeenCalled();
    });
  });
});
