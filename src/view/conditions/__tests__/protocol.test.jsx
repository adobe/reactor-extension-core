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
import Radio from '@react/react-spectrum/Radio';
import Protocol, { formConfig } from '../protocol';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const radios = wrapper.find(Radio);

  const httpRadio = radios.filterWhere(n => n.prop('value') === 'http:').node;
  const httpsRadio = radios.filterWhere(n => n.prop('value') === 'https:').node;

  return {
    httpRadio,
    httpsRadio
  };
};

describe('protocol condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Protocol, formConfig, extensionBridge));
  });

  it('sets http radio as checked by default', () => {
    extensionBridge.init();

    const { httpRadio, httpsRadio } = getReactComponents(instance);

    expect(httpRadio.props.checked).toBe(true);
    expect(httpsRadio.props.checked).toBe(false);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        protocol: 'https:'
      }
    });

    const { httpRadio, httpsRadio } = getReactComponents(instance);

    expect(httpRadio.props.checked).toBe(false, { stopPropagation() {} });
    expect(httpsRadio.props.checked).toBe(true, { stopPropagation() {} });
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { httpsRadio } = getReactComponents(instance);

    httpsRadio.props.onChange('https:', { stopPropagation() {} });

    expect(extensionBridge.getSettings()).toEqual({
      protocol: 'https:'
    });
  });
});
