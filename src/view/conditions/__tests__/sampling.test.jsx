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

import { mount } from 'enzyme';
import { TextField, Checkbox, Well } from '@adobe/react-spectrum';
import Sampling, { formConfig } from '../sampling';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const rateTextfield = wrapper.find(TextField);
  const persistCohortCheckbox = wrapper.find(Checkbox);
  const cohortResetWarning = wrapper.find(Well);

  return {
    rateTextfield,
    persistCohortCheckbox,
    cohortResetWarning
  };
};

describe('sampling condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Sampling, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        rate: 0.25,
        persistCohort: true
      }
    });

    const { rateTextfield, persistCohortCheckbox } = getReactComponents(
      instance
    );

    expect(rateTextfield.props().value).toBe('25');
    expect(persistCohortCheckbox.props().value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { rateTextfield, persistCohortCheckbox } = getReactComponents(
      instance
    );

    rateTextfield.props().onChange('25');
    persistCohortCheckbox.props().onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      rate: 0.25,
      persistCohort: true
    });
  });

  it('sets error if rate is not provided', () => {
    extensionBridge.init();

    let { rateTextfield } = getReactComponents(instance);

    rateTextfield.props().onChange('');
    expect(extensionBridge.validate()).toBe(false);

    ({ rateTextfield } = getReactComponents(instance));

    expect(rateTextfield.props().validationState).toBe('invalid');
  });

  it('sets error if rate is not a number', () => {
    extensionBridge.init();

    let { rateTextfield } = getReactComponents(instance);

    rateTextfield.props().onChange('abc');
    expect(extensionBridge.validate()).toBe(false);

    ({ rateTextfield } = getReactComponents(instance));

    expect(rateTextfield.props().validationState).toBe('invalid');
  });

  it('sets error if rate is less than 0', () => {
    extensionBridge.init();

    let { rateTextfield } = getReactComponents(instance);

    rateTextfield.props().onChange('-1');
    expect(extensionBridge.validate()).toBe(false);

    ({ rateTextfield } = getReactComponents(instance));

    expect(rateTextfield.props().validationState).toBe('invalid');
  });

  it('sets error if rate is greater than 1', () => {
    extensionBridge.init();

    let { rateTextfield } = getReactComponents(instance);

    rateTextfield.props().onChange('101');
    expect(extensionBridge.validate()).toBe(false);

    ({ rateTextfield } = getReactComponents(instance));

    expect(rateTextfield.props().validationState).toBe('invalid');
  });

  it('sets error if rate is not an integer', () => {
    extensionBridge.init();

    let { rateTextfield } = getReactComponents(instance);

    rateTextfield.props().onChange('55.55');
    expect(extensionBridge.validate()).toBe(false);

    ({ rateTextfield } = getReactComponents(instance));

    expect(rateTextfield.props().validationState).toBe('invalid');
  });

  it('shows cohort reset warning when rate changes', () => {
    extensionBridge.init({
      settings: {
        rate: 0.25,
        persistCohort: true
      }
    });

    const { rateTextfield } = getReactComponents(instance);

    rateTextfield.props().onChange('70');

    const { cohortResetWarning } = getReactComponents(instance);

    expect(cohortResetWarning.exists()).toBe(true);
  });

  it('does not show cohort reset warning when rate changes and condition is new', () => {
    extensionBridge.init();

    const { rateTextfield } = getReactComponents(instance);

    rateTextfield.props().onChange('70');

    const { cohortResetWarning } = getReactComponents(instance);

    expect(cohortResetWarning.exists()).toBe(false);
  });

  it(
    'does not show cohort reset warning when rate changes and persist cohort ' +
      'unchecked on last save',
    () => {
      extensionBridge.init({
        settings: {
          rate: 0.25
        }
      });

      const { rateTextfield, persistCohortCheckbox } = getReactComponents(
        instance
      );

      persistCohortCheckbox.props().onChange(true);
      rateTextfield.props().onChange('70');

      const { cohortResetWarning } = getReactComponents(instance);

      expect(cohortResetWarning.exists()).toBe(false);
    }
  );
});
