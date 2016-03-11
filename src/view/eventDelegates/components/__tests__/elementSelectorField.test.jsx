import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Coral from 'coralui-support-reduxform';
import { ValidationWrapper } from '@reactor/react-components';
import ElementSelectorField from '../../components/elementSelectorField';

const render = props => {
  return TestUtils.renderIntoDocument(<ElementSelectorField {...props}/>);
};

var mockProps;

describe('elementSelectorField', () => {
  beforeEach(() => {
    mockProps = {
      fields: {
        elementSelector: {
          onChange: jasmine.createSpy()
        }
      }
    };
  });

  describe('textfield', () => {
    it('receives value', () => {
      mockProps.fields.elementSelector.value = 'foo';

      const { textfield } = render(mockProps).refs;

      expect(textfield.props.value).toBe('foo');
    });

    it('calls onChange', () => {
      const { textfield } = render(mockProps).refs;

      textfield.props.onChange('foo');
      expect(mockProps.fields.elementSelector.onChange).toHaveBeenCalledWith('foo');
    });
  });

  describe('validation wrapper', () => {
    it('receives error', () => {
      mockProps.fields.elementSelector.touched = true;
      mockProps.fields.elementSelector.error = 'Test error.';
      const { validationWrapper } = render(mockProps).refs;

      expect(validationWrapper.props.error).toEqual(jasmine.any(String));
    });
  });
});
