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
import ErrorTip from '@reactor/react-components/lib/errorTip';
import { Field } from 'redux-form';
import SpecificElements, { formConfig } from '../specificElements';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';
import ElementPropertiesEditor from '../elementPropertiesEditor';
import extensionViewReduxForm from '../../../extensionViewReduxForm';

const getReactComponents = (wrapper) => {
  const showElementPropertiesCheckbox = wrapper.find(Checkbox).node;
  const elementPropertiesEditor = wrapper.find(ElementPropertiesEditor).node;
  const elementSelectorErrorTip = wrapper.find(Field)
    .filterWhere(n => n.prop('name') === 'elementSelector')
    .find(ErrorTip).node;

  return {
    showElementPropertiesCheckbox,
    elementPropertiesEditor,
    elementSelectorErrorTip
  };
};

describe('specificElements', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(SpecificElements);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('updates view properly when elementProperties provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            name: 'a',
            value: 'b'
          },
          {
            name: 'b',
            value: 'c'
          }
        ]
      }
    });

    const { showElementPropertiesCheckbox, elementPropertiesEditor } = getReactComponents(instance);
    expect(showElementPropertiesCheckbox.props.checked).toBe(true);
    expect(elementPropertiesEditor).toBeDefined();
    expect(elementPropertiesEditor.props.fields.length).toBe(2);
  });

  it('updates view properly when elementProperties not provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo'
      }
    });

    const { showElementPropertiesCheckbox, elementPropertiesEditor } = getReactComponents(instance);
    expect(showElementPropertiesCheckbox.props.checked).toBe(false);
    expect(elementPropertiesEditor).toBeUndefined();
  });

  it('removes elementProperties from settings if element properties hidden', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            name: 'a',
            value: 'b'
          }
        ]
      }
    });

    const { showElementPropertiesCheckbox } = getReactComponents(instance);

    showElementPropertiesCheckbox.props.onChange(false);

    expect(extensionBridge.getSettings().elementProperties).toBeUndefined();
  });

  it('sets error if elementSelector is not specified', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { elementSelectorErrorTip } = getReactComponents(instance);

    expect(elementSelectorErrorTip).toBeDefined();
  });

  it('removes elementProperties error if element properties not shown', () => {
    // An element property with a value but not a name would typically create a validation error
    // if the element properties editor were visible.
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            value: 'b'
          }
        ]
      }
    });

    const { showElementPropertiesCheckbox } = getReactComponents(instance);

    showElementPropertiesCheckbox.props.onChange(false);

    expect(extensionBridge.validate()).toBe(true);
  });
});
