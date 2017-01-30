/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import { mount } from 'enzyme';
import DeviceType from '../deviceType';
import CheckboxList from '../../components/checkboxList';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

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

describe('device type view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(DeviceType, extensionBridge));
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
