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
import Select from '@react/react-spectrum/Select';
import VisitorBehavior, { formConfig } from '../visitorBehavior';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const attributeSelect = wrapper.find(Select);

  return {
    attributeSelect
  };
};

describe('visitor behavior data element view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(VisitorBehavior, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        attribute: 'minutesOnSite'
      }
    });

    const { attributeSelect } = getReactComponents(instance);

    expect(attributeSelect.props().value).toBe('minutesOnSite');
  });

  it('sets form value defaults', () => {
    extensionBridge.init();

    const { attributeSelect } = getReactComponents(instance);

    expect(attributeSelect.props().value).toBe('landingPage');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { attributeSelect } = getReactComponents(instance);
    attributeSelect.props().onChange('minutesOnSite');

    expect(extensionBridge.getSettings()).toEqual({
      attribute: 'minutesOnSite'
    });
  });
});
