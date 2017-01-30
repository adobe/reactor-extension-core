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
import Textfield from '@coralui/react-coral/lib/Textfield';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import TimeSpentOnPage from '../timeSpentOnPage';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const timeOnPageTextfield = wrapper.find(Textfield).node;
  const timeOnPageErrorTip = wrapper.find(ErrorTip).node;

  return {
    timeOnPageTextfield,
    timeOnPageErrorTip
  };
};

describe('time spent on page view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(TimeSpentOnPage, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        timeOnPage: 44
      }
    });

    const { timeOnPageTextfield } = getReactComponents(instance);

    expect(timeOnPageTextfield.props.value).toBe(44);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { timeOnPageTextfield } = getReactComponents(instance);
    timeOnPageTextfield.props.onChange('55');

    expect(extensionBridge.getSettings()).toEqual({
      timeOnPage: 55
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { timeOnPageErrorTip } = getReactComponents(instance);

    expect(timeOnPageErrorTip).toBeDefined();
  });

  it('sets error if timeOnPage value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { timeOnPageTextfield, timeOnPageErrorTip } = getReactComponents(instance);

    timeOnPageTextfield.props.onChange('12.abc');

    expect(timeOnPageErrorTip).toBeDefined();
  });
});
