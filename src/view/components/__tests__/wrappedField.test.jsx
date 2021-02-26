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
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import { elementIsPosition } from '@test-helpers/react-testing-library';
import { TextField, Checkbox } from '@adobe/react-spectrum';
import WrappedField from '../wrappedField';
import bootstrap from '../../bootstrap';

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

const renderComponent = (props) => {
  extensionBridge = createExtensionBridge();

  spyOn(extensionBridge, 'openDataElementSelector').and.callFake((options) => ({
    then(resolve) {
      resolve(options.tokenize ? '%foo%' : 'foo');
    }
  }));

  window.extensionBridge = extensionBridge;
  render(bootstrap(ConnectedWrappedField, formConfig, extensionBridge, props));
  extensionBridge.init();
};

describe('wrapped field', () => {
  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets the value on the input component', () => {
    renderComponent({
      label: 'product',
      name: 'product',
      component: TextField
    });

    extensionBridge.init({
      settings: {
        product: 'foo'
      }
    });

    const inputComponent = screen.getByRole('textbox', { name: /product/i });
    expect(inputComponent.value).toBe('foo');
  });

  it('provides onChange on the input component', () => {
    renderComponent({
      label: 'product',
      name: 'product',
      component: TextField
    });

    const inputComponent = screen.getByRole('textbox', { name: /product/i });
    fireEvent.change(inputComponent, { target: { value: 'foo' } });

    expect(extensionBridge.getSettings()).toEqual({
      product: 'foo'
    });
  });

  it('handles validation error', async () => {
    renderComponent({
      label: 'product',
      name: 'product',
      component: TextField,
      errorTooltipPlacement: 'bottom'
    });

    expect(extensionBridge.validate()).toBe(false);

    const inputComponent = screen.getByRole('textbox', { name: /product/i });
    expect(inputComponent.hasAttribute('aria-invalid')).toBe(true);

    userEvent.hover(inputComponent);
    userEvent.unhover(inputComponent);
    userEvent.hover(inputComponent);

    const tooltip = await waitFor(() => screen.getByRole('tooltip'));
    within(tooltip).getByText(/bad things/i);
    expect(elementIsPosition(tooltip, 'bottom')).toBe(true);
  });

  it('sets "type" on Field to "checkbox" when Checkbox component is used', () => {
    renderComponent({
      label: 'product',
      name: 'product',
      component: Checkbox,
      children: 'some'
    });

    expect(screen.getAllByRole('checkbox').length).toBe(1);
  });

  it('supports selecting a data element token', () => {
    renderComponent({
      label: 'product',
      name: 'product',
      component: TextField,
      supportDataElement: true
    });

    fireEvent.click(
      screen.getByRole('button', { name: /select a data element/i })
    );

    expect(extensionBridge.getSettings()).toEqual({
      product: '%foo%'
    });
  });

  it('supports selecting a data element name', () => {
    renderComponent({
      label: 'product',
      name: 'product',
      component: TextField,
      supportDataElementName: true
    });

    fireEvent.click(
      screen.getByRole('button', { name: /select a data element/i })
    );

    expect(extensionBridge.getSettings()).toEqual({
      product: 'foo'
    });
  });
});
