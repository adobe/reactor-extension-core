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
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import CookieOptOut from '../cookieOptOut';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const acceptCookiesCheckbox = wrapper.find(Checkbox).node;

  return {
    acceptCookiesCheckbox
  };
};

describe('cookie out-out view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(CookieOptOut, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        acceptsCookies: true
      }
    });

    const { acceptCookiesCheckbox } = getReactComponents(instance);

    expect(acceptCookiesCheckbox.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { acceptCookiesCheckbox } = getReactComponents(instance);

    acceptCookiesCheckbox.props.onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      acceptsCookies: true
    });
  });
});
