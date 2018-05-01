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
import Radio from '@coralui/react-coral/lib/Radio';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Button from '@coralui/react-coral/lib/Button';
import Alert from '@coralui/react-coral/lib/Alert';
import { Field } from 'redux-form';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import CustomCode, { formConfig } from '../customCode';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const fields = wrapper.find(Field);
  const radios = wrapper.find(Radio);
  const javaScriptLanguageRadio = radios.filterWhere(n => n.prop('value') === 'javascript').node;
  const htmlLanguageRadio = radios.filterWhere(n => n.prop('value') === 'html').node;
  const globalCheckbox = wrapper.find(Checkbox).filterWhere(n => n.prop('name') === 'global').node;
  const sourceErrorIcon = wrapper.find(ErrorTip).node;
  const openEditorButton = fields.filterWhere(n => n.prop('name') === 'source').find(Button).node;
  const [sequentialHtmlAlert, inlineScriptAlert] = wrapper.find(Alert).nodes;

  return {
    javaScriptLanguageRadio,
    htmlLanguageRadio,
    globalCheckbox,
    sourceErrorIcon,
    openEditorButton,
    sequentialHtmlAlert,
    inlineScriptAlert
  };
};

describe('custom code action view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = window.extensionBridge = createExtensionBridge();
    spyOn(extensionBridge, 'openCodeEditor').and.callFake((options) => {
      return {
        then(resolve) {
          resolve(`${options.code} bar`);
        }
      };
    });
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

    expect(javaScriptLanguageRadio.props.checked).toBe(false);
    expect(htmlLanguageRadio.props.checked).toBe(true);
    expect(globalCheckbox).toBeUndefined();

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

    expect(javaScriptLanguageRadio.props.checked).toBe(true);
    expect(htmlLanguageRadio.props.checked).toBe(false);
    expect(globalCheckbox.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      javaScriptLanguageRadio,
      htmlLanguageRadio,
      globalCheckbox
    } = getReactComponents(instance);

    htmlLanguageRadio.props.onChange('html');
    globalCheckbox.props.onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      language: 'html'
    });

    javaScriptLanguageRadio.props.onChange('javascript');

    expect(extensionBridge.getSettings()).toEqual({
      language: 'javascript',
      global: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      sourceErrorIcon
    } = getReactComponents(instance);

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
