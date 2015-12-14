import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import ValidationWrapper from '../validationWrapper';
import ErrorIcon from '../errorIcon';
import MockComponent from './helpers/mockComponent';

describe('validation wrapper', () => {
  let getParts = component => {
    return {
      wrapper: TestUtils.findRenderedDOMComponentWithClass(component, 'ValidationWrapper'),
      field: TestUtils.findRenderedComponentWithType(component, Coral.Textfield),
      icon: TestUtils.findRenderedComponentWithType(component, ErrorIcon)
    };
  };

  let render = props => {
    return TestUtils.renderIntoDocument(
      <ValidationWrapper { ...props }>
        <Coral.Textfield/>
      </ValidationWrapper>
    );
  };

  it('shows an icon on error', () => {
    let { icon } = getParts(render({
      error: 'foo'
    }));

    expect(icon).toBeDefined();
    expect(icon.props.message).toBe('foo');
  });

  it('sets the field to invalid on error', () => {
    let { field } = getParts(render({
      error: 'foo'
    }));

    expect(field.props.invalid).toBe(true);
  });

  it('toggles the tooltip on field interaction', () => {
    let { field, icon } = getParts(render({
      error: 'foo'
    }));

    TestUtils.Simulate.focus(ReactDOM.findDOMNode(field));
    expect(icon.props.openTooltip).toBe(true);

    TestUtils.Simulate.blur(ReactDOM.findDOMNode(field));
    expect(icon.props.openTooltip).toBe(false);
  });
});
