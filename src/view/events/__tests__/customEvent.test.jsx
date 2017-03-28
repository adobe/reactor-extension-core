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
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import { Field } from 'redux-form';

import Custom from '../customEvent';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import AdvancedEventOptions from '../components/advancedEventOptions';

const getReactComponents = (wrapper) => {
  const fields = wrapper.find(Field);

  const typeField = fields.filterWhere(n => n.prop('name') === 'type');
  const typeTextfield = typeField.find(Textfield).node;
  const typeErrorTip = typeField.find(ErrorTip).node;
  const elementSelectorField = fields.filterWhere(n => n.prop('name') === 'elementSelector');
  const elementSelectorTextfield = elementSelectorField.find(Textfield).node;
  const elementSelectorErrorTip = elementSelectorField.find(ErrorTip).node;
  const bubbleStopCheckbox = wrapper.find(Checkbox)
    .filterWhere(n => n.prop('name') === 'bubbleStop').node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;

  return {
    typeTextfield,
    typeErrorTip,
    elementSelectorTextfield,
    elementSelectorErrorTip,
    bubbleStopCheckbox,
    advancedEventOptions
  };
};

describe('custom event view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Custom, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        type: 'bar',
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const {
      typeTextfield,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(typeTextfield.props.value).toBe('bar');
    expect(elementSelectorTextfield.props.value).toBe('.foo');
    expect(bubbleStopCheckbox.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const {
      typeTextfield,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    typeTextfield.props.onChange('bar');
    elementSelectorTextfield.props.onChange('.foo');
    bubbleStopCheckbox.props.onChange(true);

    const { type, elementSelector, bubbleStop } = extensionBridge.getSettings();

    expect(type).toBe('bar');
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { typeErrorTip, elementSelectorErrorTip } = getReactComponents(instance);

    expect(typeErrorTip).toBeDefined();
    expect(elementSelectorErrorTip).toBeDefined();
  });
});
