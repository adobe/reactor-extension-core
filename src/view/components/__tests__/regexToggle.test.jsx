import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import RegexToggle from '../regexToggle';

describe('regex toggle', () => {
  let getParts = component => {
    return {
      switchComponent: TestUtils.findRenderedComponentWithType(component, Coral.Switch),
      testButton: TestUtils.findRenderedDOMComponentWithTag(component, 'button')
    };
  };

  let render = props => {
    return TestUtils.renderIntoDocument(<RegexToggle { ...props }/>);
  };

  describe('with a regex value', () => {
    let parts;

    beforeEach(() => {
      parts = getParts(render({
        valueIsRegex: true
      }));
    });

    it('checks the switch', () => {
      expect(parts.switchComponent.props.checked).toBe(true);
    });

    it('shows the test button', () => {
      expect(parts.testButton.style.visibility).toBe('visible');
    });
  });

  describe('with a non-regex value', () => {
    let parts;

    beforeEach(() => {
      parts = getParts(render({
        valueIsRegex: false
      }));
    });

    it('does not check the switch', () => {
      expect(parts.switchComponent.props.checked).toBe(false);
    });

    it('hides the test button', () => {
      expect(parts.testButton.style.visibility).toBe('hidden');
    });
  });

  it('calls setValueIsRegex when switch is toggled', () => {
    let setValueIsRegex = jasmine.createSpy();

    let { switchComponent } = getParts(render({
      setValueIsRegex
    }));

    let node = ReactDOM.findDOMNode(switchComponent);

    TestUtils.Simulate.change(node, {
      target: {
        checked: true
      }
    });

    expect(setValueIsRegex).toHaveBeenCalledWith(true);

    TestUtils.Simulate.change(node, {
      target: {
        checked: false
      }
    });

    expect(setValueIsRegex).toHaveBeenCalledWith(false);
  });

  // TODO: Test interaction with regex tester once one is in place.
});
