/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

/* eslint no-useless-concat: 0 */

import { mount } from 'enzyme';
import Radio from '@react/react-spectrum/Radio';
import Checkbox from '@react/react-spectrum/Checkbox';
import EditorButton from '../../components/editorButton';
import CustomCode, { formConfig } from '../customCode';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const radios = wrapper.find(Radio);
  const javaScriptLanguageRadio = radios.filterWhere(n => n.prop('value') === 'javascript');
  const htmlLanguageRadio = radios.filterWhere(n => n.prop('value') === 'html');
  const globalCheckbox = wrapper.find(Checkbox).filterWhere(n => n.prop('name') === 'global');
  const openEditorButton = wrapper.find(EditorButton);

  return {
    javaScriptLanguageRadio,
    htmlLanguageRadio,
    globalCheckbox,
    openEditorButton
  };
};

describe('custom code action view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    instance = mount(bootstrap(CustomCode, formConfig, extensionBridge));
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        language: 'html',
        source: 'bar'
      }
    });

    let {
      javaScriptLanguageRadio,
      htmlLanguageRadio,
      globalCheckbox
    } = getReactComponents(instance);

    expect(javaScriptLanguageRadio.props().checked).toBe(false);
    expect(htmlLanguageRadio.props().checked).toBe(true);
    expect(globalCheckbox.exists()).toBe(false);

    extensionBridge.init({
      settings: {
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

    expect(javaScriptLanguageRadio.props().checked).toBe(true);
    expect(htmlLanguageRadio.props().checked).toBe(false);
    expect(globalCheckbox.props().checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      javaScriptLanguageRadio,
      htmlLanguageRadio,
      globalCheckbox
    } = getReactComponents(instance);

    htmlLanguageRadio.props().onChange(true, { stopPropagation() {} });
    globalCheckbox.props().onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      language: 'html'
    });

    javaScriptLanguageRadio.props().onChange(true, { stopPropagation() {} });

    expect(extensionBridge.getSettings()).toEqual({
      language: 'javascript',
      global: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      openEditorButton
    } = getReactComponents(instance);

    expect(openEditorButton.props().validationState).toBe('invalid');
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

    openEditorButton.props().onChange('foo bar');

    expect(extensionBridge.getSettings()).toEqual({
      language: 'javascript',
      source: 'foo bar'
    });
  });
});
