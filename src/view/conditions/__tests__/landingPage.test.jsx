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
import Textfield from '@react/react-spectrum/Textfield';
import RegexToggle from '../../components/regexToggle';
import LandingPage, { formConfig } from '../landingPage';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const pageTextfield = wrapper.find(Textfield);
  const pageRegexToggle = wrapper.find(RegexToggle);

  return {
    pageTextfield,
    pageRegexToggle
  };
};

describe('landing page condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(LandingPage, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        page: 'foo',
        pageIsRegex: true
      }
    });

    const { pageTextfield, pageRegexToggle } = getReactComponents(instance);

    expect(pageTextfield.props().value).toBe('foo');
    expect(pageRegexToggle.props().value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { pageTextfield, pageRegexToggle } = getReactComponents(instance);

    pageTextfield.props().onChange('foo');
    pageRegexToggle.props().onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      page: 'foo',
      pageIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { pageTextfield } = getReactComponents(instance);

    expect(pageTextfield.props().validationState).toBe('invalid');
  });
});
