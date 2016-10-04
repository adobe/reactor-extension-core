/* eslint no-useless-concat: 0 */

import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Radio from '@coralui/react-coral/lib/Radio';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Button from '@coralui/react-coral/lib/Button';
import Alert from '@coralui/react-coral/lib/Alert';
import { ValidationWrapper, ErrorTip } from '@reactor/react-components';

import Custom from '../custom';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const nameField =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'name').node;
  const javaScriptLanguageRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'javascript').node;
  const htmlLanguageRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'html').node;
  const sequentialCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').includes('sequential')).node;
  const globalCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').includes('global')).node;
  const nameWrapper = wrapper.find(ValidationWrapper).node;
  const sourceErrorIcon = wrapper.find(ErrorTip).node;
  const openEditorButton = wrapper.find(Button).filterWhere(n => n.prop('icon') === 'code').node;
  const sequentialHtmlAlert =
    wrapper.find(Alert).filterWhere(n => n.prop('type') === 'sequential').node;
  const inlineScriptAlert =
    wrapper.find(Alert).filterWhere(n => n.prop('type') === 'inline').node;

  return {
    nameField,
    javaScriptLanguageRadio,
    htmlLanguageRadio,
    sequentialCheckbox,
    globalCheckbox,
    nameWrapper,
    sourceErrorIcon,
    openEditorButton,
    sequentialHtmlAlert,
    inlineScriptAlert
  };
};

describe('custom action view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Custom, extensionBridge));
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

    const {
      nameField
    } = getReactComponents(instance);

    let {
      javaScriptLanguageRadio,
      htmlLanguageRadio,
      sequentialCheckbox,
      globalCheckbox
    } = getReactComponents(instance);

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
      javaScriptLanguageRadio,
      htmlLanguageRadio,
      sequentialCheckbox,
      globalCheckbox
    } = getReactComponents(instance));

    expect(javaScriptLanguageRadio.props.checked).toBe(true);
    expect(htmlLanguageRadio.props.checked).toBe(false);
    expect(sequentialCheckbox.props.checked).toBe(false);
    expect(globalCheckbox.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      nameField,
      javaScriptLanguageRadio,
      htmlLanguageRadio,
      sequentialCheckbox,
      globalCheckbox
    } = getReactComponents(instance);

    nameField.props.onChange('foo');
    htmlLanguageRadio.props.onChange('html');
    sequentialCheckbox.props.onChange(true);
    globalCheckbox.props.onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      language: 'html',
      sequential: true
    });

    javaScriptLanguageRadio.props.onChange('javascript');

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
      sourceErrorIcon
    } = getReactComponents(instance);

    expect(nameWrapper.props.error).toEqual(jasmine.any(String));
    expect(sourceErrorIcon.props.children).toBeDefined();
  });

  it('opens code editor with source value when button is clicked and stores result', () => {
    const openCodeEditorSpy = jasmine.createSpy().and.callFake((script, callback) => {
      callback('bar');
    });

    extensionBridge.init({
      settings: {
        name: 'test',
        language: 'javascript',
        source: 'foo'
      }
    });

    window.extensionBridge = {
      openCodeEditor: openCodeEditorSpy
    };

    const { openEditorButton } = getReactComponents(instance);

    openEditorButton.props.onClick();

    expect(openCodeEditorSpy).toHaveBeenCalledWith('foo', jasmine.any(Function));
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

    let {
      sequentialHtmlAlert
    } = getReactComponents(instance);

    expect(sequentialHtmlAlert).toBeUndefined();

    extensionBridge.init({
      settings: {
        language: 'html',
        sequential: true
      }
    });

    ({
      sequentialHtmlAlert
    } = getReactComponents(instance));

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

    let {
      inlineScriptAlert
    } = getReactComponents(instance);

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
    } = getReactComponents(instance));

    expect(inlineScriptAlert).toBeDefined();
  });
});
