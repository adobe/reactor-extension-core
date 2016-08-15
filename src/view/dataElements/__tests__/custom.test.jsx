import { mount } from 'enzyme';
import Button from '@coralui/react-coral/lib/Button';
import { ErrorTip } from '@reactor/react-components';

import Custom from '../custom';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const openEditorButton = wrapper.find(Button).node;
  const sourceErrorIcon = wrapper.find(ErrorTip).node;

  return {
    openEditorButton,
    sourceErrorIcon
  };
};

describe('custom view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Custom, extensionBridge));
  });

  it('opens code editor with source value when button is clicked and stores result', () => {
    extensionBridge.init({
      settings: {
        source: 'foo'
      }
    });

    window.extensionBridge = {
      openCodeEditor: jasmine.createSpy().and.callFake((source, callback) => {
        callback('bar');
      })
    };

    const { openEditorButton } = getReactComponents(instance);

    openEditorButton.props.onClick();

    expect(window.extensionBridge.openCodeEditor)
      .toHaveBeenCalledWith('foo', jasmine.any(Function));
    expect(extensionBridge.validate()).toBe(true);
    expect(extensionBridge.getSettings()).toEqual({
      source: 'bar'
    });

    delete window.extensionBridge;
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { sourceErrorIcon } = getReactComponents(instance);

    expect(sourceErrorIcon.props.children).toEqual(jasmine.any(String));
  });
});
