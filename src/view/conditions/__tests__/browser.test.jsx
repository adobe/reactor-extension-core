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
import Browser from '../browser';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import CheckboxList from '../../components/checkboxList';

const selectedBrowsers = [
  'Chrome',
  'Safari'
];

const getReactComponents = (wrapper) => {
  const browsersCheckboxList = wrapper.find(CheckboxList).node;

  return {
    browsersCheckboxList
  };
};

describe('browser view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Browser, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        browsers: selectedBrowsers
      }
    });

    const { browsersCheckboxList } = getReactComponents(instance);

    expect(browsersCheckboxList.props.input.value).toEqual(selectedBrowsers);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { browsersCheckboxList } = getReactComponents(instance);
    browsersCheckboxList.props.input.onChange(selectedBrowsers);

    expect(extensionBridge.getSettings()).toEqual({
      browsers: selectedBrowsers
    });
  });

  it('sets browsers to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getSettings()).toEqual({
      browsers: []
    });
  });
});
