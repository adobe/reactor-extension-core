/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import { mount } from 'enzyme';
import { Checkbox } from '@adobe/react-spectrum';
import AdvancedEventOptions, { formConfig } from '../advancedEventOptions';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const checkboxes = wrapper.find(Checkbox);

  const bubbleFireIfParentCheckbox = checkboxes.filterWhere(
    (n) => n.prop('name') === 'bubbleFireIfParent'
  );
  const bubbleFireIfChildFiredCheckbox = checkboxes.filterWhere(
    (n) => n.prop('name') === 'bubbleFireIfChildFired'
  );
  const bubbleStopCheckbox = checkboxes.filterWhere(
    (n) => n.prop('name') === 'bubbleStop'
  );

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
    extensionBridge = createExtensionBridge();
    instance = mount(
      bootstrap(AdvancedEventOptions, formConfig, extensionBridge)
    );
    extensionBridge.init();
  });

  beforeEach(() => {
    instance.update();
    instance.find(AdvancedEventOptions).instance().toggleSelected();
  });

  afterEach(() => {
    instance.update();
    instance.find(AdvancedEventOptions).instance().toggleSelected();
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

    expect(bubbleFireIfParentCheckbox.props().checked).toBe(true);
    expect(bubbleFireIfChildFiredCheckbox.props().checked).toBe(true);
    expect(bubbleStopCheckbox.props().checked).toBe(true);
  });

  it('has bubbleFireIfParent set to true by default', () => {
    extensionBridge.init({
      settings: {}
    });

    const { bubbleFireIfParentCheckbox } = getReactComponents(instance);

    expect(bubbleFireIfParentCheckbox.props().checked).toBe(true);
  });

  it('has bubbleFireIfChildFired set to true by default', () => {
    extensionBridge.init({
      settings: {}
    });

    const { bubbleFireIfChildFiredCheckbox } = getReactComponents(instance);

    expect(bubbleFireIfChildFiredCheckbox.props().checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      bubbleFireIfParentCheckbox,
      bubbleFireIfChildFiredCheckbox,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    bubbleFireIfParentCheckbox.props().onChange(true);
    bubbleFireIfChildFiredCheckbox.props().onChange(true);
    bubbleStopCheckbox.props().onChange(true);

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
