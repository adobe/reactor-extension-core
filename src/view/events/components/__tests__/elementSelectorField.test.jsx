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
import Button from '@coralui/react-coral/lib/Button';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';
import ElementSelector, { formConfig } from '../elementSelector';
import extensionViewReduxForm from '../../../extensionViewReduxForm';

const getReactComponents = (wrapper) => {
  const textfield = wrapper.find(Textfield).node;
  const button = wrapper.find(Button).node;
  const errorTip = wrapper.find(ErrorTip).node;

  return {
    textfield,
    button,
    errorTip
  };
};

describe('elementSelector', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(ElementSelector);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: 'foo'
      }
    });

    const { textfield } = getReactComponents(instance);

    expect(textfield.props.value).toBe('foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { textfield } = getReactComponents(instance);

    textfield.props.onChange('some prop set');

    expect(extensionBridge.getSettings()).toEqual({
      elementSelector: 'some prop set'
    });
  });

  it('sets error if element selector field is empty', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { errorTip } = getReactComponents(instance);

    expect(errorTip).toBeDefined();
  });
});
