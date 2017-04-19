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

import { mount } from 'enzyme';
import Button from '@coralui/react-coral/lib/Button';
import { ErrorTip } from '@reactor/react-components';
import CustomCode from '../customCode';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const openEditorButton = wrapper.find(Button).node;
  const sourceErrorIcon = wrapper.find(ErrorTip).node;

  return {
    openEditorButton,
    sourceErrorIcon
  };
};

describe('custom code view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = window.extensionBridge = createExtensionBridge();
    spyOn(extensionBridge, 'openCodeEditor').and.callFake((cb, options) => {
      cb(`${options.code} bar`);
    });
    instance = mount(getFormComponent(CustomCode, extensionBridge));
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('sets error if source is empty', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { sourceErrorIcon } = getReactComponents(instance);

    expect(sourceErrorIcon.props.children).toBeDefined();
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

    openEditorButton.props.onClick();

    expect(extensionBridge.getSettings()).toEqual({
      source: 'foo bar'
    });
  });
});
