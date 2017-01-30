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
import Domain from '../domain';
import CheckboxList from '../../components/checkboxList';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const domainsCheckboxList = wrapper.find(CheckboxList).node;

  return {
    domainsCheckboxList
  };
};

const domains = [
  'adobe.com',
  'example.com'
];

const selectedDomains = [
  'adobe.com'
];

describe('domain view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Domain, extensionBridge));
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

    expect(domainsCheckboxList.props.options).toEqual(domains);
    expect(domainsCheckboxList.props.input.value).toEqual(selectedDomains);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { domainsCheckboxList } = getReactComponents(instance);
    domainsCheckboxList.props.input.onChange(selectedDomains);

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
