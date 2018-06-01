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
import React from 'react';
import Button from '@react/react-spectrum/Button';
import EditorButton from '../editorButton';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';

const render = props => mount(<EditorButton { ...props } />);

const getReactComponents = (wrapper) => {
  wrapper.update();
  return {
    button: wrapper.find(Button)
  };
};

describe('editor button', () => {
  let extensionBridge;

  beforeAll(() => {
    extensionBridge = window.extensionBridge = createExtensionBridge();
    spyOn(window.extensionBridge, 'openCodeEditor').and.callFake((options) => {
      return {
        then(resolve) {
          resolve(`${options.code} bar`);
        }
      };
    });
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('sets button variant to warning when invalid', () => {
    const { button } = getReactComponents(render({
      invalid: true
    }));

    expect(button.props().variant).toBe('warning');
  });

  it('supports code editing workflow', () => {
    const onChange = jasmine.createSpy();
    const { button } = getReactComponents(render({
      invalid: true,
      value: 'foo',
      language: 'html',
      onChange
    }));

    button.props().onClick();

    expect(extensionBridge.openCodeEditor).toHaveBeenCalledWith({
      code: 'foo',
      language: 'html'
    });

    expect(onChange).toHaveBeenCalledWith('foo bar');
  });
});
