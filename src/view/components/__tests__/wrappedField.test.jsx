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

import React from 'react';
import { mount } from 'enzyme';
import Textfield from '@react/react-spectrum/Textfield';
import Checkbox from '@react/react-spectrum/Checkbox';
import RadioGroup from '@react/react-spectrum/RadioGroup';
import Button from '@react/react-spectrum/Button';
import WrappedField from '../wrappedField';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';
import ValidationWrapper from '../validationWrapper';

const getReactComponents = (wrapper, InputComponentClass) => {
  wrapper.update();
  const inputComponent = wrapper.find(InputComponentClass);
  const validationWrapper = wrapper.find(ValidationWrapper);
  const dataElementButton = wrapper.find(Button);

  return {
    inputComponent,
    validationWrapper,
    dataElementButton
  };
};

const ConnectedWrappedField = (props) => {
  // Props contain not only the specific props we provide, but also all the props that redux-form
  // passses as well. For this reason, we'll be specific on which props we pass through.
  return (
    <WrappedField
      className={ props.className }
      name={ props.name }
      component={ props.component }
      supportDataElement={ props.supportDataElement }
      supportDataElementName={ props.supportDataElementName }
      errorTooltipPlacement={ props.errorTooltipPlacement }
    />
  );
};

const formConfig = {
  settingsToFormValues(values, settings) {
    return settings;
  },
  formValuesToSettings(settings, values) {
    return values;
  },
  validate() {
    return {
      product: 'Bad things'
    };
  }
};

let extensionBridge;

const render = (props) => {
  extensionBridge = createExtensionBridge();

  spyOn(extensionBridge, 'openDataElementSelector').and.callFake((options) => {
    return {
      then(resolve) {
        resolve(options.tokenize ? '%foo%' : 'foo');
      }
    };
  });

  window.extensionBridge = extensionBridge;

  return mount(bootstrap(ConnectedWrappedField, formConfig, extensionBridge, props));
};

describe('wrapped field', () => {
  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets the value on the input component', () => {
    const instance = render({
      name: 'product',
      component: Textfield
    });

    extensionBridge.init({
      settings: {
        product: 'foo'
      }
    });

    const {
      inputComponent
    } = getReactComponents(instance, Textfield);

    expect(inputComponent.props().value).toBe('foo');
  });

  it('provides onChange on the input component', () => {
    const instance = render({
      name: 'product',
      component: Textfield
    });

    extensionBridge.init();

    const {
      inputComponent
    } = getReactComponents(instance, Textfield);

    inputComponent.props().onChange('foo');

    expect(extensionBridge.getSettings()).toEqual({
      product: 'foo'
    });
  });

  it('handles validation error', () => {
    const instance = render({
      name: 'product',
      component: Textfield
    });

    extensionBridge.init();
    extensionBridge.validate();

    const {
      inputComponent,
      validationWrapper
    } = getReactComponents(instance, Textfield);

    expect(inputComponent.props().invalid).toBe(true);
    expect(validationWrapper.props().error).toBe('Bad things');
  });

  it('supports error tooltip placement', () => {
    const instance = render({
      name: 'product',
      component: Textfield,
      errorTooltipPlacement: 'bottom'
    });

    extensionBridge.init();

    const {
      validationWrapper
    } = getReactComponents(instance, Textfield);

    expect(validationWrapper.props().placement).toBe('bottom');
  });

  it('sets "type" on Field to "checkbox" when Checkbox component is used', () => {
    const instance = render({
      name: 'product',
      component: Checkbox
    });

    extensionBridge.init();

    const {
      inputComponent
    } = getReactComponents(instance, Checkbox);

    expect(inputComponent.props().type).toBe('checkbox');
  });

  it('sets "selectedValue" when RadioGroup component is used', () => {
    const instance = render({
      name: 'product',
      component: RadioGroup
    });

    extensionBridge.init({
      settings: {
        product: 'foo'
      }
    });

    const {
      inputComponent
    } = getReactComponents(instance, RadioGroup);

    expect(inputComponent.props().selectedValue).toBe('foo');
  });

  it('supports selecting a data element token', () => {
    const instance = render({
      name: 'product',
      component: Textfield,
      supportDataElement: true
    });

    extensionBridge.init();

    const {
      dataElementButton
    } = getReactComponents(instance, Textfield);

    dataElementButton.props().onClick();

    expect(extensionBridge.getSettings()).toEqual({
      product: '%foo%'
    });
  });

  it('supports selecting a data element token', () => {
    const instance = render({
      name: 'product',
      component: Textfield,
      supportDataElementName: true
    });

    extensionBridge.init();

    const {
      dataElementButton
    } = getReactComponents(instance, Textfield);

    dataElementButton.props().onClick();

    expect(extensionBridge.getSettings()).toEqual({
      product: 'foo'
    });
  });

  it('supports a className', () => {
    const instance = render({
      name: 'product',
      component: Textfield,
      className: 'stylish'
    });

    extensionBridge.init();

    const {
      validationWrapper
    } = getReactComponents(instance, Textfield);

    expect(validationWrapper.props().className).toBe('stylish');
  });
});
