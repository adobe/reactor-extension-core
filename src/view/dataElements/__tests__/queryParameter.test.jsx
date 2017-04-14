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
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Textfield from '@coralui/react-coral/lib/Textfield';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import QueryStringParameter from '../queryStringParameter';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const nameTextfield = wrapper.find(Textfield).node;
  const nameErrorTip = wrapper.find(ErrorTip).node;
  const caseInsensitiveCheckbox = wrapper.find(Checkbox).node;

  return {
    nameTextfield,
    nameErrorTip,
    caseInsensitiveCheckbox
  };
};

describe('query string parameter view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(QueryStringParameter, extensionBridge));
  });

  it('checks case insensitive checkbox by default', () => {
    extensionBridge.init();

    const { caseInsensitiveCheckbox } = getReactComponents(instance);

    expect(caseInsensitiveCheckbox.props.checked).toBe(true);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        caseInsensitive: false
      }
    });

    const { nameTextfield, caseInsensitiveCheckbox } = getReactComponents(instance);

    expect(nameTextfield.props.value).toBe('foo');
    expect(caseInsensitiveCheckbox.props.checked).toBe(false);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameTextfield, caseInsensitiveCheckbox } = getReactComponents(instance);

    nameTextfield.props.onChange('foo');
    caseInsensitiveCheckbox.props.onChange(false);

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      caseInsensitive: false
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { nameErrorTip } = getReactComponents(instance);

    expect(nameErrorTip).toBeDefined();
  });
});
