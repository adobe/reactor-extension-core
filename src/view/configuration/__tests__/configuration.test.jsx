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
import Textfield from '@react/react-spectrum/Textfield';
import Configuration, { formConfig } from '../configuration';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const cspNonceTextfield = wrapper.find(Textfield);

  return {
    cspNonceTextfield
  };
};

describe('extension configuration view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Configuration, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        cspNonce: '%foo%'
      }
    });

    const { cspNonceTextfield } = getReactComponents(instance);

    expect(cspNonceTextfield.props().value).toBe('%foo%');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { cspNonceTextfield } = getReactComponents(instance);

    cspNonceTextfield.props().onChange('%foo%');

    expect(extensionBridge.getSettings()).toEqual({
      cspNonce: '%foo%'
    });
  });

  it('passes validation when cspNonce is not provided', () => {
    extensionBridge.init({
      settings: {}
    });
    expect(extensionBridge.validate()).toBe(true);
  });

  it('sets errors if cspNonce is not a data element', () => {
    extensionBridge.init({
      settings: {
        cspNonce: 'foo'
      }
    });
    expect(extensionBridge.validate()).toBe(false);

    const { cspNonceTextfield } = getReactComponents(instance);

    expect(cspNonceTextfield.props().validationState).toBe('invalid');
  });

  it('sets errors if cspNonce contains two data elements', () => {
    extensionBridge.init({
      settings: {
        cspNonce: '%foo%%bar%'
      }
    });
    expect(extensionBridge.validate()).toBe(false);

    const { cspNonceTextfield } = getReactComponents(instance);

    expect(cspNonceTextfield.props().validationState).toBe('invalid');
  });
});
