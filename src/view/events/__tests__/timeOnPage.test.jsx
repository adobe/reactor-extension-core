/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
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
import Textfield from '@coralui/react-coral/lib/Textfield';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import TimeOnPage, { formConfig } from '../timeOnPage';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const timeOnPageTextfield = wrapper.find(Textfield).node;
  const timeOnPageErrorTip = wrapper.find(ErrorTip).node;

  return {
    timeOnPageTextfield,
    timeOnPageErrorTip
  };
};

describe('time on page event view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(TimeOnPage, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        timeOnPage: 44
      }
    });

    const { timeOnPageTextfield } = getReactComponents(instance);

    expect(timeOnPageTextfield.props.value).toBe(44);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { timeOnPageTextfield } = getReactComponents(instance);
    timeOnPageTextfield.props.onChange('55');

    expect(extensionBridge.getSettings()).toEqual({
      timeOnPage: 55
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { timeOnPageErrorTip } = getReactComponents(instance);

    expect(timeOnPageErrorTip).toBeDefined();
  });

  it('sets error if timeOnPage value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { timeOnPageTextfield, timeOnPageErrorTip } = getReactComponents(instance);

    timeOnPageTextfield.props.onChange('12.abc');

    expect(timeOnPageErrorTip).toBeDefined();
  });
});
