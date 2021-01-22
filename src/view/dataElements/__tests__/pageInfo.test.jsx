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
import { Picker } from '@adobe/react-spectrum';
import PageInfo, { formConfig } from '../pageInfo';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const attributeSelect = wrapper.find(Picker);

  return {
    attributeSelect
  };
};

describe('page info data element view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(PageInfo, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        attribute: 'protocol'
      }
    });

    const { attributeSelect } = getReactComponents(instance);

    expect(attributeSelect.props().value).toBe('protocol');
  });

  it('sets form value defaults', () => {
    extensionBridge.init();

    const { attributeSelect } = getReactComponents(instance);

    expect(attributeSelect.props().value).toBe('url');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { attributeSelect } = getReactComponents(instance);
    attributeSelect.props().onChange('protocol');

    expect(extensionBridge.getSettings()).toEqual({
      attribute: 'protocol'
    });
  });
});
