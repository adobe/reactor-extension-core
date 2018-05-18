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
import TrafficSource, { formConfig } from '../trafficSource';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const sourceTextfield = wrapper.find(Textfield).node;
  const valueRegexToggle = wrapper.find(RegexToggle).node;

  return {
    sourceTextfield,
    valueRegexToggle
  };
};

describe('traffic source condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(TrafficSource, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        source: 'foo',
        sourceIsRegex: true
      }
    });

    const { sourceTextfield, valueRegexToggle } = getReactComponents(instance);

    expect(sourceTextfield.props.value).toBe('foo');
    expect(valueRegexToggle.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { sourceTextfield, valueRegexToggle } = getReactComponents(instance);

    sourceTextfield.props.onChange('foo');
    valueRegexToggle.props.onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      source: 'foo',
      sourceIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { sourceTextfield } = getReactComponents(instance);

    expect(sourceTextfield.props.invalid).toBe(true);
  });
});
