import Custom from '../custom';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('custom action view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(Custom, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        language: 'html',
        sequential: true,
        source: 'bar'
      }
    });

    var {
      nameField,
      javaScriptLanguageRadio,
      htmlLanguageRadio,
      sequentialCheckbox,
      globalCheckbox
    } = instance.refs;

    expect(nameField.props.value).toBe('foo');
    expect(javaScriptLanguageRadio.props.checked).toBe(false);
    expect(htmlLanguageRadio.props.checked).toBe(true);
    expect(sequentialCheckbox.props.checked).toBe(true);
    expect(globalCheckbox).toBeUndefined();

    extensionBridge.init({
      settings: {
        name: 'foo',
        language: 'javascript',
        sequential: false,
        global: true,
        source: 'bar'
      }
    });

    ({
      nameField,
      javaScriptLanguageRadio,
      htmlLanguageRadio,
      sequentialCheckbox,
      globalCheckbox
    } = instance.refs);

    expect(javaScriptLanguageRadio.props.checked).toBe(true);
    expect(htmlLanguageRadio.props.checked).toBe(false);
    expect(sequentialCheckbox.props.checked).toBe(false);
    expect(globalCheckbox.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    var {
      nameField,
      javaScriptLanguageRadio,
      htmlLanguageRadio,
      sequentialCheckbox,
      globalCheckbox
    } = instance.refs;

    nameField.props.onChange('foo');
    htmlLanguageRadio.props.onChange('html');
    sequentialCheckbox.props.onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      language: 'html',
      sequential: true
    });

    javaScriptLanguageRadio.props.onChange('javascript');
    globalCheckbox.props.onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      language: 'javascript',
      sequential: true,
      global: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      nameWrapper,
      scriptErrorIcon
    } = instance.refs;

    expect(nameWrapper.props.error).toEqual(jasmine.any(String));
    expect(scriptErrorIcon).toBeDefined();
  });

  it('opens code editor with source value when button is clicked and stores result', () => {
    extensionBridge.init({
      settings: {
        name: 'test',
        language: 'javascript',
        source: 'foo'
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
    expect(extensionBridge.getSettings()).toEqual({
      name: 'test',
      language: 'javascript',
      source: 'bar'
    });

    delete window.extensionBridge;
  });
  
  it('shows sequential html alert when HTML and sequential are selected', () => {
    extensionBridge.init();

    var {
      sequentialHtmlAlert
    } = instance.refs;

    expect(sequentialHtmlAlert).toBeUndefined();

    extensionBridge.init({
      settings: {
        language: 'html',
        sequential: true
      }
    });

    ({
      sequentialHtmlAlert
    } = instance.refs);

    expect(sequentialHtmlAlert).toBeDefined();
  });

  it('shows inline script alert when HTML and sequential are selected and ' +
    'inline script is found', () => {
    extensionBridge.init({
      settings: {
        language: 'html',
        sequential: true,
        source: 'foo <script src="abc.js"></scr' + 'ipt> bar'
      }
    });

    var {
      inlineScriptAlert
    } = instance.refs;

    expect(inlineScriptAlert).toBeUndefined();

    extensionBridge.init({
      settings: {
        language: 'html',
        sequential: true,
        source: 'foo <script></scr' + 'ipt> bar'
      }
    });

    ({
      inlineScriptAlert
    } = instance.refs);

    expect(inlineScriptAlert).toBeDefined();
  });
});
