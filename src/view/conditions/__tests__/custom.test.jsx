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
import Button from '@coralui/react-coral/lib/Button';
import { ErrorTip } from '@reactor/react-components';
import Custom from '../custom';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const openEditorButton = wrapper.find(Button).node;
  const sourceErrorIcon = wrapper.find(ErrorTip).node;

  return {
    openEditorButton,
    sourceErrorIcon
  };
};

describe('custom view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = window.extensionBridge = createExtensionBridge();
    spyOn(extensionBridge, 'openCodeEditor').and.callFake((code, cb) => cb(`${code} bar`));
    instance = mount(getFormComponent(Custom, extensionBridge));
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('sets error if source is empty', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { sourceErrorIcon } = getReactComponents(instance);

    expect(sourceErrorIcon.props.children).toBeDefined();
  });

  it('allows user to provide custom code', () => {
    extensionBridge.init({
      settings: {
        source: 'foo'
      }
    });

    const {
      openEditorButton
    } = getReactComponents(instance);

    openEditorButton.props.onClick();

    expect(extensionBridge.getSettings()).toEqual({
      source: 'foo bar'
    });
  });
});
