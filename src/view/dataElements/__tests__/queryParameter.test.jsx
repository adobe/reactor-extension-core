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
import Textfield from '@coralui/react-coral/lib/Textfield';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import QueryParameter from '../queryParameter';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const nameTextfield = wrapper.find(Textfield).node;
  const nameErrorTip = wrapper.find(ErrorTip).node;
  const caseInsensitiveCheckbox = wrapper.find(Checkbox).node;

  return {
    nameTextfield,
    nameErrorTip,
    caseInsensitiveCheckbox
  };
};

describe('query parameter view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(QueryParameter, extensionBridge));
  });

  it('checks case insensitive checkbox by default', () => {
    extensionBridge.init();

    const { caseInsensitiveCheckbox } = getReactComponents(instance);

    expect(caseInsensitiveCheckbox.props.checked).toBe(true);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        caseInsensitive: false
      }
    });

    const { nameTextfield, caseInsensitiveCheckbox } = getReactComponents(instance);

    expect(nameTextfield.props.value).toBe('foo');
    expect(caseInsensitiveCheckbox.props.checked).toBe(false);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameTextfield, caseInsensitiveCheckbox } = getReactComponents(instance);

    nameTextfield.props.onChange('foo');
    caseInsensitiveCheckbox.props.onChange(false);

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      caseInsensitive: false
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { nameErrorTip } = getReactComponents(instance);

    expect(nameErrorTip).toBeDefined();
  });
});
