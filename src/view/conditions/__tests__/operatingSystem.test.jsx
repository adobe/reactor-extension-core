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
