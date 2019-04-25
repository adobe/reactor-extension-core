/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import { mount } from 'enzyme';
import EditorButton from '../../components/editorButton';
import CustomCode, { formConfig } from '../customCode';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const openEditorButton = wrapper.find(EditorButton);

  return {
    openEditorButton
  };
};

describe('custom code event view', () => {
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

  it('sets error if source is empty', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { openEditorButton } = getReactComponents(instance);

    expect(openEditorButton.props().validationState).toBe('invalid');
  });

  it('allows user to provide custom code', () => {
    extensionBridge.init({
      settings: {
        source: 'foo'
      }
    });

    const {
      openEditorButton
    } = getReactComponents(instance);

    openEditorButton.props().onChange('foo bar');

    expect(extensionBridge.getSettings()).toEqual({
      source: 'foo bar'
    });
  });
});
