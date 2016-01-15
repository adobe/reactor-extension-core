import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import RegexToggle from '../regexToggle';

const render = props => {
  return TestUtils.renderIntoDocument(<RegexToggle {...props}/>);
};

const getParts = instance => {
  return {
    regexSwitch: TestUtils.findRenderedComponentWithType(instance, Coral.Switch),
    testButton: TestUtils.findRenderedDOMComponentWithTag(instance, 'button')
  };
};

describe('regex toggle', () => {
  beforeEach(() => {
    window.extensionBridge = {
      openRegexTester: jasmine.createSpy().and.callFake((value, callback) => {
        callback('bar');
      })
    }
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets switch to checked when valueIsRegex=true', () => {
    const { regexSwitch } = getParts(render({
      valueIsRegex: true
    }));

    expect(regexSwitch.props.checked).toBe(true);
  });

  it('calls onValueIsRegexChange when switch is toggled', () => {
    const onValueIsRegexChange = jasmine.createSpy();
    const { regexSwitch } = getParts(render({
      onValueIsRegexChange
    }));

    regexSwitch.props.onChange({
      target: {
        checked: true
      }
    });

    expect(onValueIsRegexChange).toHaveBeenCalledWith(true);
  });

  it('supports regex testing+updating workflow', () => {
    const onValueChange = jasmine.createSpy();
    const { testButton } = getParts(render({
      valueIsRegex: true,
      value: 'foo',
      onValueChange
    }));

    TestUtils.Simulate.click(testButton);

    expect(window.extensionBridge.openRegexTester)
      .toHaveBeenCalledWith('foo', jasmine.any(Function));
    expect(onValueChange).toHaveBeenCalledWith('bar');
  });

  it('shows test link when valueIsRegex=true', () => {
    const { testButton } = getParts(render({
      valueIsRegex: true
    }));

    expect(testButton.style.visibility).toBe('visible');
  });

  it('hides test link when valueIsRegex=false', () => {
    const { testButton } = getParts(render({
      valueIsRegex: false
    }));

    expect(testButton.style.visibility).toBe('hidden');
  });
});
