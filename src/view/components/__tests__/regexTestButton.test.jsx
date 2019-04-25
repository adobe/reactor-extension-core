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
import { mount } from 'enzyme';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import RegexTestButton from '../regexTestButton';

describe('regex test button', () => {
  let extensionBridge;
  let instance;
  let onChange;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();

    spyOn(extensionBridge, 'openRegexTester').and.callFake(() => ({
      then(resolve) {
        resolve('bar');
      }
    }));

    window.extensionBridge = extensionBridge;

    onChange = jasmine.createSpy();

    instance = mount(<RegexTestButton value="foo" onChange={onChange} />);
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('supports regex testing+updating workflow', () => {
    const button = instance.find('button');

    button.simulate('click');

    expect(extensionBridge.openRegexTester).toHaveBeenCalledWith({
      pattern: 'foo',
      flags: 'i'
    });

    expect(onChange).toHaveBeenCalledWith('bar');
  });
});
