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
import Checkbox from '@react/react-spectrum/Checkbox';
import CookieOptOut, { formConfig } from '../cookieOptOut';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const acceptCookiesCheckbox = wrapper.find(Checkbox);

  return {
    acceptCookiesCheckbox
  };
};

describe('cookie out-out condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(CookieOptOut, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        acceptsCookies: true
      }
    });

    const { acceptCookiesCheckbox } = getReactComponents(instance);

    expect(acceptCookiesCheckbox.props().checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { acceptCookiesCheckbox } = getReactComponents(instance);

    acceptCookiesCheckbox.props().onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      acceptsCookies: true
    });
  });
});
