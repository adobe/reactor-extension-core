import React from 'react';
import { mount } from 'enzyme';
import Button from '@coralui/react-coral/lib/Button';
import ErrorTip from '@reactor/react-components/lib/errorTip';

import EditorButton from '../editorButton';

const getReactComponents = (wrapper) => ({
  button: wrapper.find(Button).node,
  errorTip: wrapper.find(ErrorTip).node
});

const render = props => mount(<EditorButton { ...props } />);

describe('editor button', () => {
  beforeEach(() => {
    window.extensionBridge = {
      openCodeEditor: (value, cb) => cb(`${value} bar`)
    };
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('opens the code editor when button clicked and updates value when saved', () => {
    const onChange = jasmine.createSpy();

    const { button } = getReactComponents(render({
      input: {
        onChange,
        value: 'foo'
      },
      meta: {
        touched: false,
        error: null
      }
    }));

    button.props.onClick();

    expect(onChange).toHaveBeenCalledWith('foo bar');
  });

  it('shows error when touched and has an error', () => {
    const { errorTip } = getReactComponents(render({
      input: {
        onChange: () => {},
        value: 'foo'
      },
      meta: {
        touched: true,
        error: 'Oh nos!'
      }
    }));

    expect(errorTip).toBeDefined();
  });
});
