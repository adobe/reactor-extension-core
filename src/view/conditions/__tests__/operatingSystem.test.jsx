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
import OperatingSystem from '../operatingSystem';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import CheckboxList from '../../components/checkboxList';

const selectedOperatingSystems = [
  'Windows',
  'Unix'
];

const getReactComponents = (wrapper) => {
  const operatingSystemsCheckboxList = wrapper.find(CheckboxList).node;

  return {
    operatingSystemsCheckboxList
  };
};

describe('operating system view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(OperatingSystem, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operatingSystems: selectedOperatingSystems
      }
    });

    const { operatingSystemsCheckboxList } = getReactComponents(instance);

    expect(operatingSystemsCheckboxList.props.input.value).toEqual(selectedOperatingSystems);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatingSystemsCheckboxList } = getReactComponents(instance);
    operatingSystemsCheckboxList.props.input.onChange(selectedOperatingSystems);

    expect(extensionBridge.getSettings()).toEqual({
      operatingSystems: selectedOperatingSystems
    });
  });

  it('sets operatingSystems to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getSettings()).toEqual({
      operatingSystems: []
    });
  });
});
