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
import Select from '@react/react-spectrum/Select';
import WrappedField from '../../components/wrappedField';
import ScreenResolution, { formConfig } from '../screenResolution';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const comparisonOperatorSelects = wrapper.find(Select);
  const fields = wrapper.find(WrappedField);

  const widthOperatorSelect = comparisonOperatorSelects
    .filterWhere(n => n.prop('name') === 'widthOperator').node;
  const heightOperatorSelect = comparisonOperatorSelects
    .filterWhere(n => n.prop('name') === 'heightOperator').node;
  const widthField = fields.filterWhere(n => n.prop('name') === 'width');
  const widthTextfield = widthField.find(Textfield).node;
  const heightField = fields.filterWhere(n => n.prop('name') === 'height');
  const heightTextfield = heightField.find(Textfield).node;

  return {
    widthOperatorSelect,
    widthTextfield,
    heightOperatorSelect,
    heightTextfield
  };
};

describe('screen resolution condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(ScreenResolution, formConfig, extensionBridge));
  });

  it('sets operators to greater than by default', () => {
    extensionBridge.init();

    const { widthOperatorSelect, heightOperatorSelect } = getReactComponents(instance);

    expect(widthOperatorSelect.props.value).toBe('>');
    expect(heightOperatorSelect.props.value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        widthOperator: '=',
        width: 100,
        heightOperator: '<',
        height: 200
      }
    });

    const {
      widthOperatorSelect,
      widthTextfield,
      heightOperatorSelect,
      heightTextfield
    } = getReactComponents(instance);

    expect(widthOperatorSelect.props.value).toBe('=');
    expect(widthTextfield.props.value).toBe(100);
    expect(heightOperatorSelect.props.value).toBe('<');
    expect(heightTextfield.props.value).toBe(200);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      widthOperatorSelect,
      widthTextfield,
      heightOperatorSelect,
      heightTextfield
    } = getReactComponents(instance);

    widthOperatorSelect.props.onChange('=');
    widthTextfield.props.onChange(100);
    heightOperatorSelect.props.onChange('<');
    heightTextfield.props.onChange(200);

    expect(extensionBridge.getSettings()).toEqual({
      widthOperator: '=',
      width: 100,
      heightOperator: '<',
      height: 200
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      widthTextfield,
      heightTextfield
    } = getReactComponents(instance);

    expect(widthTextfield.props.invalid).toBe(true);
    expect(heightTextfield.props.invalid).toBe(true);
  });

  it('sets errors if values are not numbers', () => {
    extensionBridge.init();

    const {
      widthTextfield,
      heightTextfield
    } = getReactComponents(instance);

    widthTextfield.props.onChange('12.abc');
    heightTextfield.props.onChange('12.abc');

    expect(extensionBridge.validate()).toBe(false);
    expect(widthTextfield.props.invalid).toBe(true);
    expect(heightTextfield.props.invalid).toBe(true);
  });
});
