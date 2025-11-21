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

import { fireEvent, render } from '@testing-library/react';
import { sharedTestingElements } from '@test-helpers/react-testing-library.jsx';
import createExtensionBridge from '@test-helpers/createExtensionBridge.jsx';
import AdvancedEventOptions, { formConfig } from '../advancedEventOptions.jsx'
import bootstrap from '../../../bootstrap.jsx'

describe('advancedEventOptions', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(AdvancedEventOptions, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        bubbleFireIfParent: true,
        bubbleStop: true,
        bubbleFireIfChildFired: true
      }
    });

    fireEvent.click(sharedTestingElements.advancedSettings.getToggleTrigger());

    expect(
      sharedTestingElements.advancedSettings.getBubbleFireIfParentCheckbox()
        .checked
    ).toBe(true);
    expect(
      sharedTestingElements.advancedSettings.getBubbleFireIfChildFiredCheckbox()
        .checked
    ).toBe(true);
    expect(
      sharedTestingElements.advancedSettings.getBubbleStopCheckBox().checked
    ).toBe(true);
  });

  it('has bubbleFireIfParent set to true by default', () => {
    extensionBridge.init({
      settings: {}
    });

    fireEvent.click(sharedTestingElements.advancedSettings.getToggleTrigger());
    expect(
      sharedTestingElements.advancedSettings.getBubbleFireIfParentCheckbox()
        .checked
    ).toBe(true);
  });

  it('has bubbleFireIfChildFired set to true by default', () => {
    extensionBridge.init({
      settings: {}
    });

    fireEvent.click(sharedTestingElements.advancedSettings.getToggleTrigger());
    expect(
      sharedTestingElements.advancedSettings.getBubbleFireIfChildFiredCheckbox()
        .checked
    ).toBe(true);
  });

  it('by default, the checkboxes are in the expected their expected states', () => {
    fireEvent.click(sharedTestingElements.advancedSettings.getToggleTrigger());

    expect(
      sharedTestingElements.advancedSettings.getBubbleFireIfParentCheckbox()
        .checked
    ).toBe(true);
    expect(
      sharedTestingElements.advancedSettings.getBubbleFireIfChildFiredCheckbox()
        .checked
    ).toBe(true);
    expect(
      sharedTestingElements.advancedSettings.getBubbleStopCheckBox().checked
    ).toBe(false);
  });

  it('sets settings from form values', async () => {
    fireEvent.click(sharedTestingElements.advancedSettings.getToggleTrigger());

    // this checkbox defaults on. checking our form really works.
    fireEvent.click(
      sharedTestingElements.advancedSettings.getBubbleFireIfParentCheckbox()
    );
    expect(
      sharedTestingElements.advancedSettings.getBubbleFireIfParentCheckbox()
        .checked
    ).toBe(false);
    expect(extensionBridge.getSettings().bubbleFireIfParent).toBe(false);
    fireEvent.click(
      sharedTestingElements.advancedSettings.getBubbleFireIfParentCheckbox()
    );
    expect(
      sharedTestingElements.advancedSettings.getBubbleFireIfParentCheckbox()
        .checked
    ).toBe(true);
    expect(extensionBridge.getSettings().bubbleFireIfParent).toBe(true);

    // this checkbox defaults on. checking our form really works.
    fireEvent.click(
      sharedTestingElements.advancedSettings.getBubbleFireIfChildFiredCheckbox()
    );
    expect(
      sharedTestingElements.advancedSettings.getBubbleFireIfChildFiredCheckbox()
        .checked
    ).toBe(false);
    expect(extensionBridge.getSettings().bubbleFireIfChildFired).toBe(false);
    fireEvent.click(
      sharedTestingElements.advancedSettings.getBubbleFireIfChildFiredCheckbox()
    );
    expect(
      sharedTestingElements.advancedSettings.getBubbleFireIfChildFiredCheckbox()
        .checked
    ).toBe(true);
    expect(extensionBridge.getSettings().bubbleFireIfChildFired).toBe(true);

    // this checkbox defaults off. checking our form really works.
    fireEvent.click(
      sharedTestingElements.advancedSettings.getBubbleStopCheckBox()
    );
    expect(
      sharedTestingElements.advancedSettings.getBubbleStopCheckBox().checked
    ).toBe(true);
    expect(extensionBridge.getSettings().bubbleStop).toBe(true);
    fireEvent.click(
      sharedTestingElements.advancedSettings.getBubbleStopCheckBox()
    );
    expect(
      sharedTestingElements.advancedSettings.getBubbleStopCheckBox().checked
    ).toBe(false);
    expect(extensionBridge.getSettings().bubbleStop).toBe(false);
  });
});
