import React from 'react';
import TestUtils from 'react-addons-test-utils';

import DataElementNameField from '../dataElementNameField';

const render = props => {
  return TestUtils.renderIntoDocument(<DataElementNameField {...props}/>);
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
    const { textfield } = render({
      value: 'foo'
    }).refs;

    expect(textfield.props.value).toBe('foo');
  });

  it('sets invalid prop on textfield', () => {
    const { textfield } = render({
      invalid: true
    }).refs;

    expect(textfield.props.invalid).toBe(true);
  });

  it('support data element selector workflow when clicking textfield', () => {
    const onChange = jasmine.createSpy();
    const { textfield } = render({
      onChange
    }).refs;

    textfield.props.onClick();

    expect(window.extensionBridge.openDataElementSelector)
      .toHaveBeenCalledWith(jasmine.any(Function));
    expect(onChange).toHaveBeenCalledWith('foo');
  });

  it('support data element selector workflow when clicking button', () => {
    const onChange = jasmine.createSpy();
    const { button } = render({
      onChange
    }).refs;

    button.props.onClick();

    expect(window.extensionBridge.openDataElementSelector)
      .toHaveBeenCalledWith(jasmine.any(Function));
    expect(onChange).toHaveBeenCalledWith('foo');
  });
});
