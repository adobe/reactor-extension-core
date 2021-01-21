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
import { TextField, Picker, Well, Checkbox } from '@adobe/react-spectrum';
import WrappedField from '../../components/wrappedField';
import ValueComparison, { formConfig } from '../valueComparison';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const fields = wrapper.find(WrappedField);
  const leftOperandField = fields.filterWhere(
    (n) => n.prop('name') === 'leftOperand'
  );
  const leftOperandTextfield = leftOperandField.find(TextField);

  const operatorField = fields.filterWhere(
    (n) => n.prop('name') === 'operator'
  );
  const operatorSelect = operatorField.find(Picker);

  const rightOperandField = fields.filterWhere(
    (n) => n.prop('name') === 'rightOperand'
  );
  const rightOperandTextfield = rightOperandField.find(TextField);

  const caseInsensitiveField = fields.filterWhere(
    (n) => n.prop('name') === 'caseInsensitive'
  );
  const caseInsensitiveCheckbox = caseInsensitiveField.find(Checkbox);

  const noTypeConversionReminders = wrapper.find(Well);

  return {
    leftOperandTextfield,
    operatorSelect,
    rightOperandTextfield,
    caseInsensitiveCheckbox,
    noTypeConversionReminders
  };
};

describe('value comparison condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(ValueComparison, formConfig, extensionBridge));
  });

  describe('equal-based comparisons', () => {
    ['equals', 'doesNotEqual'].forEach((operator) => {
      describe(`when operator is ${operator}`, () => {
        it('sets form values from settings ', () => {
          extensionBridge.init({
            settings: {
              leftOperand: '%foo%',
              comparison: {
                operator,
                caseInsensitive: true
              },
              // We're using 0 here because it also tests whether falsy values
              // are handled appropriately.
              rightOperand: 0
            }
          });

          const {
            leftOperandTextfield,
            operatorSelect,
            rightOperandTextfield,
            caseInsensitiveCheckbox
          } = getReactComponents(instance);

          expect(leftOperandTextfield.props().value).toBe('%foo%');
          expect(operatorSelect.props().value).toBe(operator);
          expect(rightOperandTextfield.props().value).toBe('0');
          expect(caseInsensitiveCheckbox.props().checked).toBe(true);
        });

        it('sets settings from form values', () => {
          extensionBridge.init();

          const { leftOperandTextfield, operatorSelect } = getReactComponents(
            instance
          );

          leftOperandTextfield.props().onChange('%foo%');
          operatorSelect.props().onChange(operator);

          const {
            rightOperandTextfield,
            caseInsensitiveCheckbox
          } = getReactComponents(instance);

          rightOperandTextfield.props().onChange('123');
          caseInsensitiveCheckbox.props().onChange(true);

          expect(extensionBridge.getSettings()).toEqual({
            leftOperand: '%foo%',
            comparison: {
              operator,
              caseInsensitive: true
            },
            rightOperand: 123
          });
        });

        it('sets errors if required values are not provided', () => {
          extensionBridge.init({
            settings: {
              comparison: {
                operator
              }
            }
          });

          expect(extensionBridge.validate()).toBe(false);

          const {
            leftOperandTextfield,
            rightOperandTextfield
          } = getReactComponents(instance);

          expect(leftOperandTextfield.props().validationState).toBe('invalid');
          // We allow empty strings for equals operands because users may want to check to
          // see if a value equals an empty string.
          expect(rightOperandTextfield.props().validationState).toBeUndefined();
        });
      });
    });
  });

  describe('string-based comparisons', () => {
    [
      'contains',
      'doesNotContain',
      'startsWith',
      'doesNotStartWith',
      'endsWith',
      'doesNotEndWith',
      'matchesRegex',
      'doesNotMatchRegex'
    ].forEach((operator) => {
      describe(`when operator is ${operator}`, () => {
        it('sets form values from settings ', () => {
          extensionBridge.init({
            settings: {
              leftOperand: '%foo%',
              comparison: {
                operator,
                caseInsensitive: true
              },
              rightOperand: 'bar'
            }
          });

          const {
            leftOperandTextfield,
            operatorSelect,
            rightOperandTextfield,
            caseInsensitiveCheckbox
          } = getReactComponents(instance);

          expect(leftOperandTextfield.props().value).toBe('%foo%');
          expect(operatorSelect.props().value).toBe(operator);
          expect(rightOperandTextfield.props().value).toBe('bar');
          expect(caseInsensitiveCheckbox.props().checked).toBe(true);
        });

        it('sets settings from form values', () => {
          extensionBridge.init();

          const { leftOperandTextfield, operatorSelect } = getReactComponents(
            instance
          );

          leftOperandTextfield.props().onChange('%foo%');
          operatorSelect.props().onChange(operator);

          const {
            rightOperandTextfield,
            caseInsensitiveCheckbox
          } = getReactComponents(instance);

          rightOperandTextfield.props().onChange('bar');
          caseInsensitiveCheckbox.props().onChange(true);

          expect(extensionBridge.getSettings()).toEqual({
            leftOperand: '%foo%',
            comparison: {
              operator,
              caseInsensitive: true
            },
            rightOperand: 'bar'
          });
        });

        it('sets errors if required values are not provided', () => {
          extensionBridge.init({
            settings: {
              comparison: {
                operator
              }
            }
          });

          expect(extensionBridge.validate()).toBe(false);

          const {
            leftOperandTextfield,
            rightOperandTextfield
          } = getReactComponents(instance);

          expect(leftOperandTextfield.props().validationState).toBe('invalid');
          expect(rightOperandTextfield.props().validationState).toBe('invalid');
        });
      });
    });
  });

  describe('number-based comparisons', () => {
    [
      'lessThan',
      'lessThanOrEqual',
      'greaterThan',
      'greaterThanOrEqual'
    ].forEach((operator) => {
      describe(`when operator is ${operator}`, () => {
        it('sets form values from settings', () => {
          extensionBridge.init({
            settings: {
              leftOperand: '%foo%',
              comparison: {
                operator
              },
              rightOperand: 456
            }
          });

          const {
            leftOperandTextfield,
            operatorSelect,
            rightOperandTextfield
          } = getReactComponents(instance);

          expect(leftOperandTextfield.props().value).toBe('%foo%');
          expect(operatorSelect.props().value).toBe(operator);
          expect(rightOperandTextfield.props().value).toBe('456');
        });

        it('sets settings from form values', () => {
          extensionBridge.init();

          const { leftOperandTextfield, operatorSelect } = getReactComponents(
            instance
          );

          leftOperandTextfield.props().onChange('%foo%');
          operatorSelect.props().onChange(operator);

          const { rightOperandTextfield } = getReactComponents(instance);

          rightOperandTextfield.props().onChange('456');

          expect(extensionBridge.getSettings()).toEqual({
            leftOperand: '%foo%',
            comparison: {
              operator
            },
            rightOperand: 456
          });
        });

        it('sets errors if required values are not provided', () => {
          extensionBridge.init({
            settings: {
              leftOperand: '',
              comparison: {
                operator
              },
              rightOperand: ''
            }
          });

          expect(extensionBridge.validate()).toBe(false);

          const {
            leftOperandTextfield,
            rightOperandTextfield
          } = getReactComponents(instance);

          expect(leftOperandTextfield.props().validationState).toBe('invalid');
          expect(rightOperandTextfield.props().validationState).toBe('invalid');
        });
      });
    });
  });

  describe('static right operand comparisons', () => {
    ['isTrue', 'isTruthy', 'isFalse', 'isFalsy'].forEach((operator) => {
      describe(`when operator is ${operator}`, () => {
        it('sets form values from settings', () => {
          extensionBridge.init({
            settings: {
              leftOperand: '%foo%',
              comparison: {
                operator
              }
            }
          });

          const { leftOperandTextfield, operatorSelect } = getReactComponents(
            instance
          );

          expect(leftOperandTextfield.props().value).toBe('%foo%');
          expect(operatorSelect.props().value).toBe(operator);
        });

        it('sets settings from form values', () => {
          extensionBridge.init();

          const { leftOperandTextfield, operatorSelect } = getReactComponents(
            instance
          );

          leftOperandTextfield.props().onChange('%foo%');
          operatorSelect.props().onChange(operator);

          expect(extensionBridge.getSettings()).toEqual({
            leftOperand: '%foo%',
            comparison: {
              operator
            }
          });
        });

        it('sets errors if required values are not provided', () => {
          extensionBridge.init({
            settings: {
              comparison: {
                operator
              }
            }
          });
          expect(extensionBridge.validate()).toBe(false);

          const { leftOperandTextfield } = getReactComponents(instance);

          expect(leftOperandTextfield.props().validationState).toBe('invalid');
        });
      });
    });
  });

  it('warns user about no type conversions for specific string values', () => {
    extensionBridge.init({
      settings: {
        leftOperand: '%foo%',
        comparison: {
          operator: 'equals',
          caseInsensitive: true
        },
        rightOperand: 'true'
      }
    });

    const { noTypeConversionReminders } = getReactComponents(instance);

    expect(noTypeConversionReminders.length).toBe(1);
  });
});
