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
import React from 'react';
import { Button } from '@adobe/react-spectrum';
import EditorButton from '../editorButton';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';

const render = (props) => mount(<EditorButton {...props} />);

const getReactComponents = (wrapper) => {
  wrapper.update();
  return {
    button: wrapper.find(Button)
  };
};

describe('editor button', () => {
  let extensionBridge;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    spyOn(window.extensionBridge, 'openCodeEditor').and.callFake((options) => ({
      then(resolve) {
        resolve(`${options.code} bar`);
      }
    }));
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('sets button variant to warning when invalid', () => {
    const { button } = getReactComponents(
      render({
        validationState: 'invalid'
      })
    );

    expect(button.props().variant).toBe('negative');
  });

  it('supports code editing workflow', () => {
    const onChange = jasmine.createSpy();
    const { button } = getReactComponents(
      render({
        invalid: true,
        value: 'foo',
        language: 'html',
        onChange
      })
    );

    button.props().onPress();

    expect(extensionBridge.openCodeEditor).toHaveBeenCalledWith({
      code: 'foo',
      language: 'html'
    });

    expect(onChange).toHaveBeenCalledWith('foo bar');
  });
});
