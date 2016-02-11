import TestUtils from 'react-addons-test-utils';

import Custom from '../custom';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(Custom);

describe('custom view', () => {
  it('opens code editor with script value when button is clicked and stores result', () => {
    extensionBridge.init({
      config: {
        script: 'foo'
      }
    });

    window.extensionBridge = {
      openCodeEditor: jasmine.createSpy().and.callFake((script, callback) => {
        callback('bar');
      })
    };

    const { openEditorButton } = instance.refs;

    openEditorButton.props.onClick();

    expect(window.extensionBridge.openCodeEditor)
      .toHaveBeenCalledWith('foo', jasmine.any(Function));
    expect(extensionBridge.validate()).toBe(true);
    expect(extensionBridge.getConfig()).toEqual({
      script: 'bar'
    });

    delete window.extensionBridge;
  });

  it('sets error if script is empty', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { scriptErrorIcon } = instance.refs;

    expect(scriptErrorIcon.props.message).toBeDefined();
  });
});
