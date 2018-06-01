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
import WrappedField from '../../components/wrappedField';
import QueryStringParameter, { formConfig } from '../queryStringParameter';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const fields = wrapper.find(WrappedField);

  const nameField = fields.filterWhere(n => n.prop('name') === 'name');
  const nameTextfield = nameField.find(Textfield);
  const valueField = fields.filterWhere(n => n.prop('name') === 'value');
  const valueTextfield = valueField.find(Textfield);
  const valueRegexToggle = wrapper.find(RegexToggle);

  return {
    nameTextfield,
    valueTextfield,
    valueRegexToggle
  };
};

describe('query string parameter condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(QueryStringParameter, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      }
    });

    const { nameTextfield, valueTextfield, valueRegexToggle } = getReactComponents(instance);

    expect(nameTextfield.props().value).toBe('foo');
    expect(valueTextfield.props().value).toBe('bar');
    expect(valueRegexToggle.props().value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameTextfield, valueTextfield, valueRegexToggle } = getReactComponents(instance);

    nameTextfield.props().onChange('foo');
    valueTextfield.props().onChange('bar');
    valueRegexToggle.props().onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      value: 'bar',
      valueIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { nameTextfield, valueTextfield } = getReactComponents(instance);

    expect(nameTextfield.props().invalid).toBe(true);
    expect(valueTextfield.props().invalid).toBe(true);
  });
});
