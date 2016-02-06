import React from 'react';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import DataElementNameField from '../dataElementNameField';
import DataElementSelectorButton from '../dataElementSelectorButton';

const render = props => {
  return TestUtils.renderIntoDocument(<DataElementNameField {...props}/>);
};

const getParts = instance => {
  return {
    textfield: TestUtils.findRenderedComponentWithType(instance, Coral.Textfield),
    selectorButton: TestUtils.findRenderedComponentWithType(instance, DataElementSelectorButton)
  };
};

describe('data element name field', () => {
  beforeEach(() => {
    window.extensionBridge = {
      openDataElementSelector: jasmine.createSpy().and.callFake(callback => callback('foo'))
    };
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets value on textfield', () => {
    const { textfield } = getParts(render({
      value: 'foo'
    }));

    expect(textfield.props.value).toBe('foo');
  });

  it('sets invalid prop on textfield', () => {
    const { textfield } = getParts(render({
      invalid: true
    }));

    expect(textfield.props.invalid).toBe(true);
  });

  it('support data element selector workflow when clicking textfield', () => {
    const onChange = jasmine.createSpy();
    const { textfield } = getParts(render({
      onChange
    }));

    textfield.props.onClick();

    expect(window.extensionBridge.openDataElementSelector)
      .toHaveBeenCalledWith(jasmine.any(Function));
    expect(onChange).toHaveBeenCalledWith('foo');
  });

  it('support data element selector workflow when clicking button', () => {
    const onChange = jasmine.createSpy();
    const { selectorButton } = getParts(render({
      onChange
    }));

    selectorButton.props.onClick();

    expect(window.extensionBridge.openDataElementSelector)
      .toHaveBeenCalledWith(jasmine.any(Function));
    expect(onChange).toHaveBeenCalledWith('foo');
  });
});
