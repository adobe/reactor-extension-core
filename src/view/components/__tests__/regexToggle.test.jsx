import React from 'react';
import TestUtils from 'react-addons-test-utils';
import RegexToggle from '../regexToggle';

const render = props => {
  return TestUtils.renderIntoDocument(<RegexToggle {...props}/>);
};

describe('regex toggle', () => {
  beforeEach(() => {
    window.extensionBridge = {
      openRegexTester: jasmine.createSpy().and.callFake((value, callback) => {
        callback('bar');
      })
    };
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets switch to checked when valueIsRegex=true', () => {
    const { regexSwitch } = render({
      valueIsRegex: true
    }).refs;

    expect(regexSwitch.props.checked).toBe(true);
  });

  it('calls onValueIsRegexChange when switch is toggled', () => {
    const onValueIsRegexChange = jasmine.createSpy();
    const { regexSwitch } = render({
      onValueIsRegexChange
    }).refs;

    regexSwitch.props.onChange({
      target: {
        checked: true
      }
    });

    expect(onValueIsRegexChange).toHaveBeenCalledWith(true);
  });

  it('supports regex testing+updating workflow', () => {
    const onValueChange = jasmine.createSpy();
    const { testButton } = render({
      valueIsRegex: true,
      value: 'foo',
      onValueChange
    }).refs;

    TestUtils.Simulate.click(testButton);

    expect(window.extensionBridge.openRegexTester)
      .toHaveBeenCalledWith('foo', jasmine.any(Function));
    expect(onValueChange).toHaveBeenCalledWith('bar');
  });

  it('shows test link when valueIsRegex=true', () => {
    const { testButton } = render({
      valueIsRegex: true
    }).refs;

    expect(testButton.style.visibility).toBe('visible');
  });

  it('hides test link when valueIsRegex=false', () => {
    const { testButton } = render({
      valueIsRegex: false
    }).refs;

    expect(testButton.style.visibility).toBe('hidden');
  });
});
