import React from 'react';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import ValidationWrapper from '../validationWrapper';
import ErrorIcon from '../errorIcon';

const render = props => {
  return TestUtils.renderIntoDocument(
    <ValidationWrapper {...props}>
      <div>
        <div>
          <Coral.Textfield/>
        </div>
      </div>
    </ValidationWrapper>
  );
};

const getParts = instance => {
  const errorIcons = TestUtils.scryRenderedComponentsWithType(instance, ErrorIcon);
  return {
    container: TestUtils.scryRenderedDOMComponentsWithTag(instance, 'div')[0],
    textfield: TestUtils.findRenderedComponentWithType(instance, Coral.Textfield),
    errorIcon: errorIcons.length ? errorIcons[0] : null
  };
};

describe('validation wrapper', () => {
  it('sets invalid on descendants and adds error icon when error is defined', () => {
    const { textfield, errorIcon } = getParts(render({
      error: 'foo'
    }));

    expect(textfield.props.invalid).toBe(true);
    expect(errorIcon).not.toBeNull();
  });

  it('neither sets invalid on descendants nor adds error icon when error is undefined', () => {
    const { textfield, errorIcon } = getParts(render());

    expect(textfield.props.invalid).toBe(false);
    expect(errorIcon).toBeNull();
  });

  it('shows tooltip when focused, hides on blur', () => {
    const { container, errorIcon } = getParts(render({
      error: 'foo'
    }));

    TestUtils.Simulate.focus(container);

    expect(errorIcon.props.openTooltip).toBe(true);

    TestUtils.Simulate.blur(container);

    expect(errorIcon.props.openTooltip).toBe(false);
  });
});
