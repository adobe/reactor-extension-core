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
import DeviceType, { formConfig } from '../deviceType';
import CheckboxList from '../../components/checkboxList';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const selectedDeviceTypes = [
  'Desktop',
  'Android'
];

const getReactComponents = (wrapper) => {
  const deviceOptionsCheckboxList = wrapper.find(CheckboxList).node;

  return {
    deviceOptionsCheckboxList
  };
};

describe('device type condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(DeviceType, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        deviceTypes: selectedDeviceTypes
      }
    });

    const { deviceOptionsCheckboxList } = getReactComponents(instance);

    expect(deviceOptionsCheckboxList.props.input.value).toEqual(selectedDeviceTypes);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { deviceOptionsCheckboxList } = getReactComponents(instance);
    deviceOptionsCheckboxList.props.input.onChange(selectedDeviceTypes);

    expect(extensionBridge.getSettings()).toEqual({
      deviceTypes: selectedDeviceTypes
    });
  });

  it('sets deviceTypes to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getSettings()).toEqual({
      deviceTypes: []
    });
  });
});
