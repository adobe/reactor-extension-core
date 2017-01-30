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
import extensionViewReduxForm from '../../../extensionViewReduxForm';
import AdvancedEventOptions, { formConfig } from '../advancedEventOptions';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const checkboxes = wrapper.find(Checkbox);

  const bubbleFireIfParentCheckbox = checkboxes
    .filterWhere(n => n.prop('name') === 'bubbleFireIfParent').node;
  const bubbleFireIfChildFiredCheckbox = checkboxes
    .filterWhere(n => n.prop('name') === 'bubbleFireIfChildFired').node;
  const bubbleStopCheckbox = checkboxes.filterWhere(n => n.prop('name') === 'bubbleStop').node;

  return {
    bubbleFireIfParentCheckbox,
    bubbleFireIfChildFiredCheckbox,
    bubbleStopCheckbox
  };
};

describe('advancedEventOptions', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(AdvancedEventOptions);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
    extensionBridge.init();
  });

  beforeEach(() => {
    instance.find(AdvancedEventOptions).node.toggleSelected();
  });

  afterEach(() => {
    instance.find(AdvancedEventOptions).node.toggleSelected();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        bubbleFireIfParent: true,
        bubbleStop: true,
        bubbleFireIfChildFired: true
      }
    });

    const {
      bubbleFireIfParentCheckbox,
      bubbleFireIfChildFiredCheckbox,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(bubbleFireIfParentCheckbox.props.checked).toBe(true);
    expect(bubbleFireIfChildFiredCheckbox.props.checked).toBe(true);
    expect(bubbleStopCheckbox.props.checked).toBe(true);
  });

  it('has bubbleFireIfParent set to true by default', () => {
    extensionBridge.init({
      settings: {}
    });

    const {
      bubbleFireIfParentCheckbox
    } = getReactComponents(instance);

    expect(bubbleFireIfParentCheckbox.props.checked).toBe(true);
  });

  it('has bubbleFireIfChildFired set to true by default', () => {
    extensionBridge.init({
      settings: {}
    });

    const {
      bubbleFireIfChildFiredCheckbox
    } = getReactComponents(instance);

    expect(bubbleFireIfChildFiredCheckbox.props.checked).toBe(true);
  });


  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      bubbleFireIfParentCheckbox,
      bubbleFireIfChildFiredCheckbox,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    bubbleFireIfParentCheckbox.props.onChange(true);
    bubbleFireIfChildFiredCheckbox.props.onChange(true);
    bubbleStopCheckbox.props.onChange(true);

    const {
      bubbleFireIfParent,
      bubbleStop,
      bubbleFireIfChildFired
    } = extensionBridge.getSettings();

    expect(bubbleFireIfParent).toBe(true);
    expect(bubbleStop).toBe(true);
    expect(bubbleFireIfChildFired).toBe(true);
  });
});
