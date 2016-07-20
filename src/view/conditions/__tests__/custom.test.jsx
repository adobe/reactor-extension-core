import Custom from '../custom';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('custom view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(Custom, extensionBridge);
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

    const { openEditorButton } = instance.refs;

    openEditorButton.props.onClick();

    expect(window.extensionBridge.openCodeEditor)
      .toHaveBeenCalledWith('foo', jasmine.any(Function));
    expect(extensionBridge.validate()).toBe(true);
    expect(extensionBridge.getSettings()).toEqual({
      source: 'bar'
    });

    delete window.extensionBridge;
  });

  it('sets error if source is empty', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { sourceErrorIcon } = instance.refs;

    expect(sourceErrorIcon.props.message).toBeDefined();
  });
});
