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

import React from 'react';
import { mount } from 'enzyme';
import {
  TextField,
  Checkbox,
  RadioGroup,
  ActionButton
} from '@adobe/react-spectrum';
import WrappedField from '../wrappedField';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';
import ValidationWrapper from '../validationWrapper';

const getReactComponents = (wrapper, InputComponentClass) => {
  wrapper.update();
  const inputComponent = wrapper.find(InputComponentClass);
  const validationWrapper = wrapper.find(ValidationWrapper);
  const dataElementButton = wrapper.find(ActionButton);

  return {
    inputComponent,
    validationWrapper,
    dataElementButton
  };
};

const ConnectedWrappedField = ({
  className,
  name,
  label,
  component,
  supportDataElement,
  supportDataElementName,
  children,
  errorTooltipPlacement
}) => (
  // Props contain not only the specific props we provide, but also all the props that redux-form
  // passses as well. For this reason, we'll be specific on which props we pass through.
  <WrappedField
    className={className}
    name={name}
    label={label}
    component={component}
    supportDataElement={supportDataElement}
    supportDataElementName={supportDataElementName}
    errorTooltipPlacement={errorTooltipPlacement}
  >
    {children}
  </WrappedField>
);

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

  spyOn(extensionBridge, 'openDataElementSelector').and.callFake((options) => ({
    then(resolve) {
      resolve(options.tokenize ? '%foo%' : 'foo');
    }
  }));

  window.extensionBridge = extensionBridge;

  return mount(
    bootstrap(ConnectedWrappedField, formConfig, extensionBridge, props)
  );
};

describe('wrapped field', () => {
  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets the value on the input component', () => {
    const instance = render({
      label: 'product',
      name: 'product',
      component: TextField
    });

    extensionBridge.init({
      settings: {
        product: 'foo'
      }
    });

    const { inputComponent } = getReactComponents(instance, TextField);

    expect(inputComponent.props().value).toBe('foo');
  });

  it('provides onChange on the input component', () => {
    const instance = render({
      label: 'product',
      name: 'product',
      component: TextField
    });

    extensionBridge.init();

    const { inputComponent } = getReactComponents(instance, TextField);

    inputComponent.props().onChange('foo');

    expect(extensionBridge.getSettings()).toEqual({
      product: 'foo'
    });
  });

  it('handles validation error', () => {
    const instance = render({
      label: 'product',
      name: 'product',
      component: TextField
    });

    extensionBridge.init();
    extensionBridge.validate();

    const { inputComponent, validationWrapper } = getReactComponents(
      instance,
      TextField
    );

    expect(inputComponent.props().validationState).toBe('invalid');
    expect(validationWrapper.props().error).toBe('Bad things');
  });

  it('supports error tooltip placement', () => {
    const instance = render({
      label: 'product',
      name: 'product',
      component: TextField,
      errorTooltipPlacement: 'bottom'
    });

    extensionBridge.init();

    const { validationWrapper } = getReactComponents(instance, TextField);

    expect(validationWrapper.props().placement).toBe('bottom');
  });

  it('sets "type" on Field to "checkbox" when Checkbox component is used', () => {
    const instance = render({
      label: 'product',
      name: 'product',
      component: Checkbox,
      children: 'some'
    });

    extensionBridge.init();

    const { inputComponent } = getReactComponents(instance, Checkbox);

    expect(inputComponent.props().type).toBe('checkbox');
  });

  it('sets "selectedValue" when RadioGroup component is used', () => {
    const instance = render({
      label: 'product',
      name: 'product',
      component: RadioGroup
    });

    extensionBridge.init({
      settings: {
        product: 'foo'
      }
    });

    const { inputComponent } = getReactComponents(instance, RadioGroup);
    expect(inputComponent.props().value).toBe('foo');
  });

  it('supports selecting a data element token', () => {
    const instance = render({
      label: 'product',
      name: 'product',
      component: TextField,
      supportDataElement: true
    });

    extensionBridge.init();

    const { dataElementButton } = getReactComponents(instance, TextField);

    dataElementButton.props().onPress();

    expect(extensionBridge.getSettings()).toEqual({
      product: '%foo%'
    });
  });

  it('supports selecting a data element name', () => {
    const instance = render({
      label: 'product',
      name: 'product',
      component: TextField,
      supportDataElementName: true
    });

    extensionBridge.init();

    const { dataElementButton } = getReactComponents(instance, TextField);

    dataElementButton.props().onPress();

    expect(extensionBridge.getSettings()).toEqual({
      product: 'foo'
    });
  });
});
