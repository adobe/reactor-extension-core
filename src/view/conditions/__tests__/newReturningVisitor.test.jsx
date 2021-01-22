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
import { RadioGroup } from '@adobe/react-spectrum';
import NewReturningVisitor, { formConfig } from '../newReturningVisitor';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();

  return {
    radioGroup: wrapper.find(RadioGroup)
  };
};

describe('new/returning visitor condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(
      bootstrap(NewReturningVisitor, formConfig, extensionBridge)
    );
  });

  it('sets new visitor radio as checked by default', () => {
    extensionBridge.init();

    const { radioGroup } = getReactComponents(instance);

    expect(radioGroup.props().value).toBe('new');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        isNewVisitor: false
      }
    });

    const { radioGroup } = getReactComponents(instance);
    expect(radioGroup.props().value).toBe('returning');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { radioGroup } = getReactComponents(instance);
    radioGroup.props().onChange('returning', { stopPropagation() {} });

    expect(extensionBridge.getSettings()).toEqual({
      isNewVisitor: false
    });
  });
});
