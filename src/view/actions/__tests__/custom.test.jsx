/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

/* eslint no-useless-concat: 0 */

import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Radio from '@coralui/react-coral/lib/Radio';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Button from '@coralui/react-coral/lib/Button';
import Alert from '@coralui/react-coral/lib/Alert';
import { Field } from 'redux-form';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import Custom from '../custom';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const fields = wrapper.find(Field);
  const radios = wrapper.find(Radio);
  const nameField = fields.filterWhere(n => n.prop('name') === 'name');
  const nameTextfield = nameField.find(Textfield).node;
  const nameErrorTip = nameField.find(ErrorTip).node;
  const javaScriptLanguageRadio = radios.filterWhere(n => n.prop('value') === 'javascript').node;
  const htmlLanguageRadio = radios.filterWhere(n => n.prop('value') === 'html').node;
  const globalCheckbox = wrapper.find(Checkbox).filterWhere(n => n.prop('name') === 'global').node;
  const sourceErrorIcon = wrapper.find(ErrorTip).node;
  const openEditorButton = fields.filterWhere(n => n.prop('name') === 'source').find(Button).node;
  const [sequentialHtmlAlert, inlineScriptAlert] = wrapper.find(Alert).nodes;

  return {
    nameTextfield,
    nameErrorTip,
    javaScriptLanguageRadio,
    htmlLanguageRadio,
    globalCheckbox,
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
    extensionBridge = window.extensionBridge = createExtensionBridge();
    spyOn(extensionBridge, 'openCodeEditor').and.callFake((code, cb) => cb(`${code} bar`));
    instance = mount(getFormComponent(Custom, extensionBridge));
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        language: 'html',
        source: 'bar'
      }
    });

    const {
      nameTextfield
    } = getReactComponents(instance);

    let {
      javaScriptLanguageRadio,
      htmlLanguageRadio,
      globalCheckbox
    } = getReactComponents(instance);

    expect(nameTextfield.props.value).toBe('foo');
    expect(javaScriptLanguageRadio.props.checked).toBe(false);
    expect(htmlLanguageRadio.props.checked).toBe(true);
    expect(globalCheckbox).toBeUndefined();

    extensionBridge.init({
      settings: {
        name: 'foo',
        language: 'javascript',
        global: true,
        source: 'bar'
      }
    });

    ({
      javaScriptLanguageRadio,
      htmlLanguageRadio,
      globalCheckbox
    } = getReactComponents(instance));

    expect(javaScriptLanguageRadio.props.checked).toBe(true);
    expect(htmlLanguageRadio.props.checked).toBe(false);
    expect(globalCheckbox.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      nameTextfield,
      javaScriptLanguageRadio,
      htmlLanguageRadio,
      globalCheckbox
    } = getReactComponents(instance);

    nameTextfield.props.onChange('foo');
    htmlLanguageRadio.props.onChange('html');
    globalCheckbox.props.onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      language: 'html'
    });

    javaScriptLanguageRadio.props.onChange('javascript');

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      language: 'javascript',
      global: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      nameErrorTip,
      sourceErrorIcon
    } = getReactComponents(instance);

    expect(nameErrorTip.props.children).toEqual(jasmine.any(String));
    expect(sourceErrorIcon.props.children).toBeDefined();
  });

  it('allows user to provide custom code', () => {
    extensionBridge.init({
      settings: {
        language: 'javascript',
        source: 'foo'
      }
    });

    const {
      openEditorButton
    } = getReactComponents(instance);

    openEditorButton.props.onClick();

    expect(extensionBridge.getSettings()).toEqual({
      language: 'javascript',
      source: 'foo bar'
    });
  });
});
