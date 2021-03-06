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
import { fireEvent, render, screen } from '@testing-library/react';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import RegexTestButton from '../regexTestButton';

// react-testing-library element selectors
const pageElements = {
  getRegexTestButton: () => screen.getByRole('button', { name: /test/i })
};

describe('regex test button', () => {
  let extensionBridge;
  let onChange;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;

    spyOn(extensionBridge, 'openRegexTester').and.callFake(() => ({
      then(resolve) {
        resolve('bar');
      }
    }));

    onChange = jasmine.createSpy();

    render(<RegexTestButton value="foo" onChange={onChange} />);
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('supports regex testing+updating workflow', () => {
    fireEvent.click(pageElements.getRegexTestButton());

    expect(extensionBridge.openRegexTester).toHaveBeenCalledWith({
      pattern: 'foo',
      flags: 'i'
    });

    expect(onChange).toHaveBeenCalledWith('bar');
  });
});
