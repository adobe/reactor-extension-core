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
import ErrorTip from '@reactor/react-components/lib/errorTip';
import Textfield from '@coralui/react-coral/lib/Textfield';
import PreviousConverter from '../previousConverter';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const dataElementTextfield = wrapper.find(Textfield).node;
  const dataElementErrorTip = wrapper.find(ErrorTip).node;

  return {
    dataElementTextfield,
    dataElementErrorTip
  };
};

describe('previous converter view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(PreviousConverter, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        dataElement: 'foo'
      }
    });

    const { dataElementTextfield } = getReactComponents(instance);

    expect(dataElementTextfield.props.value).toBe('foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { dataElementTextfield } = getReactComponents(instance);

    dataElementTextfield.props.onChange('foo');

    expect(extensionBridge.getSettings()).toEqual({
      dataElement: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { dataElementErrorTip } = getReactComponents(instance);

    expect(dataElementErrorTip).toBeDefined();
  });
});
