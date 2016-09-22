import React from 'react';
import { mount } from 'enzyme';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Button from '@coralui/react-coral/lib/Button';

import ElementSelectorField from '../../components/elementSelectorField';

const getReactComponents = (wrapper) => {
  const textfield = wrapper.find(Textfield).node;
  const button = wrapper.find(Button).node;
  const validationWrapper = wrapper.find(ValidationWrapper).node;

  return {
    textfield,
    button,
    validationWrapper
  };
};

const render = props => mount(<ElementSelectorField { ...props } />);

let mockProps;

describe('elementSelectorField', () => {
  beforeEach(() => {
    mockProps = {
      fields: {
        elementSelector: {
          onChange: jasmine.createSpy()
        }
      }
    };

    window.extensionBridge = {
      openCssSelector: () => {}
    };
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  describe('textfield', () => {
    it('receives value', () => {
      mockProps.fields.elementSelector.value = 'foo';

      const { textfield } = getReactComponents(render(mockProps));

      expect(textfield.props.value).toBe('foo');
    });

    it('calls onChange', () => {
      const { textfield } = getReactComponents(render(mockProps));

      textfield.props.onChange('foo');
      expect(mockProps.fields.elementSelector.onChange).toHaveBeenCalledWith('foo');
    });
  });

  describe('validation wrapper', () => {
    it('receives error', () => {
      mockProps.fields.elementSelector.touched = true;
      mockProps.fields.elementSelector.error = 'Test error.';
      const { validationWrapper } = getReactComponents(render(mockProps));

      expect(validationWrapper.props.error).toEqual(jasmine.any(String));
    });
  });

  it('opens the css selector modal', () => {
    mockProps = {
      fields: {
        elementSelector: {
          onChange: jasmine.createSpy().and.callFake(value => {
            mockProps.fields.elementSelector.value = value;
          })
        }
      }
    };
    const { button } = getReactComponents(render(mockProps));

    spyOn(window.extensionBridge, 'openCssSelector').and.callFake(callback => {
      callback('foo');
    });

    button.props.onClick();

    const { textfield } = getReactComponents(render(mockProps));

    expect(window.extensionBridge.openCssSelector).toHaveBeenCalled();
    expect(textfield.props.value).toBe('foo');
  });
});
