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
import Radio from '@coralui/react-coral/lib/Radio';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import { Field } from 'redux-form';
import Hover from '../hover';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import AdvancedEventOptions from '../components/advancedEventOptions';

const getReactComponents = (wrapper) => {
  const fields = wrapper.find(Field);

  const elementSelectorField = fields.filterWhere(n => n.prop('name') === 'elementSelector');
  const elementSelectorTextfield = elementSelectorField.find(Textfield).node;
  const elementSelectorErrorTip = elementSelectorField.find(ErrorTip).node;
  const bubbleStopCheckbox = wrapper
    .find(Checkbox).filterWhere(n => n.prop('name') === 'bubbleStop').node;
  const delayField = fields.filterWhere(n => n.prop('name') === 'delay');
  const delayTextfield = delayField.find(Textfield).node;
  const delayErrorTip = delayField.find(ErrorTip).node;
  const delayRadio = wrapper.find(Radio).filterWhere(n => n.prop('value') === 'delay').node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;

  return {
    elementSelectorTextfield,
    elementSelectorErrorTip,
    bubbleStopCheckbox,
    delayTextfield,
    delayErrorTip,
    delayRadio,
    advancedEventOptions
  };
};

describe('hover view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Hover, extensionBridge));

    extensionBridge.init();

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        delay: 100,
        bubbleStop: true
      }
    });

    const {
      elementSelectorTextfield,
      delayTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(elementSelectorTextfield.props.value).toBe('.foo');
    expect(delayTextfield.props.value).toBe(100);
    expect(bubbleStopCheckbox.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    const { delayRadio } = getReactComponents(instance);
    delayRadio.props.onChange('delay');

    const {
      elementSelectorTextfield,
      delayTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    elementSelectorTextfield.props.onChange('.foo');
    delayTextfield.props.onChange(100);
    bubbleStopCheckbox.props.onChange(true);

    const { elementSelector, delay, bubbleStop } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
    expect(delay).toBe(100);
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    const {
      delayRadio
    } = getReactComponents(instance);

    delayRadio.props.onChange('delay');
    expect(extensionBridge.validate()).toBe(false);

    const {
      delayErrorTip,
      elementSelectorErrorTip
    } = getReactComponents(instance);

    expect(delayErrorTip).toBeDefined();
    expect(elementSelectorErrorTip).toBeDefined();
  });
});
