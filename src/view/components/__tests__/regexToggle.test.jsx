import React from 'react';
import { mount } from 'enzyme';
import RegexToggle from '../regexToggle';
import Switch from '@coralui/react-coral/lib/Switch';

const getReactComponents = (wrapper) => {
  const regexSwitch = wrapper.find(Switch).node;
  const testButton = wrapper.find('button');

  return {
    regexSwitch,
    testButton
  };
};

const render = props => mount(<RegexToggle { ...props } />);

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
    const { regexSwitch } = getReactComponents(render({
      valueIsRegex: true
    }));

    expect(regexSwitch.props.checked).toBe(true);
  });

  it('calls onValueIsRegexChange when switch is toggled', () => {
    const onValueIsRegexChange = jasmine.createSpy();
    const { regexSwitch } = getReactComponents(render({
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
    const { testButton } = getReactComponents(render({
      valueIsRegex: true,
      value: 'foo',
      onValueChange
    }));

    testButton.simulate('click');

    expect(window.extensionBridge.openRegexTester)
      .toHaveBeenCalledWith('foo', jasmine.any(Function));
    expect(onValueChange).toHaveBeenCalledWith('bar');
  });

  it('shows test link when valueIsRegex=true', () => {
    const { testButton } = getReactComponents(render({
      valueIsRegex: true
    }));

    expect(testButton.node.style.visibility).toBe('visible');
  });

  it('hides test link when valueIsRegex=false', () => {
    const { testButton } = getReactComponents(render({
      valueIsRegex: false
    }));

    expect(testButton.node.style.visibility).toBe('hidden');
  });
});
