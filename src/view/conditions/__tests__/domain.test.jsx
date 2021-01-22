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
import { CheckboxGroup } from '@adobe/react-spectrum';
import Domain, { formConfig } from '../domain';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const domainsCheckboxList = wrapper.find(CheckboxGroup);

  return {
    domainsCheckboxList
  };
};

const domains = ['adobe.com', 'example.com'];

const selectedDomains = ['adobe.com'];

describe('domain condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Domain, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        domains: selectedDomains
      },
      propertySettings: {
        domains
      }
    });

    const { domainsCheckboxList } = getReactComponents(instance);

    expect(domainsCheckboxList.props().children.map((d) => d.key)).toEqual(
      domains
    );
    expect(domainsCheckboxList.props().value).toEqual(selectedDomains);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { domainsCheckboxList } = getReactComponents(instance);
    domainsCheckboxList.props().onChange(selectedDomains);

    expect(extensionBridge.getSettings()).toEqual({
      domains: selectedDomains
    });
  });

  it('sets domains to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getSettings()).toEqual({
      domains: []
    });
  });
});
