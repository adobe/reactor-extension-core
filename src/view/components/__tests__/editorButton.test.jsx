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

import React from 'react';
import { fireEvent, render as rtlRender, screen } from '@testing-library/react';
import { isButtonValid } from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import EditorButton from '../editorButton';

const render = (props) => rtlRender(<EditorButton {...props} />);

// react-testing-library element selectors
const pageElements = {
  getButton: () => screen.getByRole('button')
};

describe('editor button', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    spyOn(window.extensionBridge, 'openCodeEditor').and.callFake((options) => ({
      then(resolve) {
        resolve(`${options.code} bar`);
      }
    }));
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets button variant to warning when invalid', () => {
    render({
      validationState: 'invalid'
    });

    expect(isButtonValid(pageElements.getButton())).toBeFalse();
  });

  it('supports code editing workflow', () => {
    const onChange = jasmine.createSpy();
    render({
      invalid: true,
      value: 'foo',
      language: 'html',
      onChange
    });

    fireEvent.click(pageElements.getButton());

    expect(extensionBridge.openCodeEditor).toHaveBeenCalledWith({
      code: 'foo',
      language: 'html'
    });

    expect(onChange).toHaveBeenCalledWith('foo bar');
  });
});
