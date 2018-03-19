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
import { connect } from 'react-redux';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import { Field, formValueSelector } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import Alert from '@coralui/react-coral/lib/Alert';
import Select from '@coralui/redux-form-react-coral/lib/Select';
import RegexTestButton from '../components/regexTestButton';

const operators = {
  EQUALS: 'equals',
  CONTAINS: 'contains',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
  MATCHES_REGEX: 'matchesRegex',
  LESS_THAN: 'lessThan',
  LESS_THAN_OR_EQUAL_TO: 'lessThanOrEqualTo',
  GREATER_THAN: 'greaterThan',
  GREATER_THAN_OR_EQUAL_TO: 'greaterThanOrEqualTo',
  IS_TRUE: 'isTrue',
  IS_TRUTHY: 'isTruthy'
};

const operatorMeta = {
  [operators.EQUALS]: {
    // We don't have isOperandLengthRequired set to true for the equals operator because
    // creating a comparison to determine if a value equals an empty string is a legit
    // use case.
    label: 'Equals',
    isCaseSensitivitySupported: true,
    isRightOperandSupported: true
  },
  [operators.CONTAINS]: {
    label: 'Contains',
    isCaseSensitivitySupported: true,
    isRightOperandSupported: true,
    isOperandLengthRequired: true
  },
  [operators.STARTS_WITH]: {
    label: 'Starts With',
    isCaseSensitivitySupported: true,
    isRightOperandSupported: true,
    isOperandLengthRequired: true
  },
  [operators.ENDS_WITH]: {
    label: 'Ends With',
    isCaseSensitivitySupported: true,
    isRightOperandSupported: true,
    isOperandLengthRequired: true
  },
  [operators.MATCHES_REGEX]: {
    label: 'Matches Regex',
    isCaseSensitivitySupported: true,
    isRightOperandSupported: true,
    isOperandLengthRequired: true
  },
  [operators.LESS_THAN]: {
    label: 'Less Than',
    isRightOperandSupported: true,
    isOperandLengthRequired: true
  },
  [operators.LESS_THAN_OR_EQUAL_TO]: {
    label: 'Less Than Or Equal To',
    isRightOperandSupported: true,
    isOperandLengthRequired: true
  },
  [operators.GREATER_THAN]: {
    label: 'Greater Than',
    isRightOperandSupported: true,
    isOperandLengthRequired: true
  },
  [operators.GREATER_THAN_OR_EQUAL_TO]: {
    label: 'Less Than Or Equal To',
    isRightOperandSupported: true,
    isOperandLengthRequired: true
  },
  [operators.IS_TRUE]: {
    label: 'Is True',
    isOperandLengthRequired: true
  },
  [operators.IS_TRUTHY]: {
    label: 'Is Truthy',
    isOperandLengthRequired: true
  }
};

const operatorOptions = Object.keys(operatorMeta).map(operator => (
  {
    value: operator,
    label: operatorMeta[operator].label
  }
));

const NoConversionReminder = (props) => {
  const noConversionStrings = [
    'true',
    'false',
    'null',
    'undefined'
  ];

  return props.operator === operators.EQUALS &&
    noConversionStrings.indexOf(props.value.toLowerCase()) !== -1 ?
    (
      <Alert className="u-block" variant="warning">
        Be aware that the value &quot;{props.value}&quot; will be compared as a string.
      </Alert>
    ) : null;
};

const RightOperandFields = (props) => {
  if (operatorMeta[props.operator].isRightOperandSupported) {
    return props.operator === operators.MATCHES_REGEX ?
      (
        <div>
          <Field
            name="rightOperand"
            className="u-gapRight"
            component={ DecoratedInput }
            inputComponent={ Textfield }
          />
          <Field
            name="rightOperand"
            className="u-gapRight"
            component={ RegexTestButton }
            flags={ props.caseInsensitive ? 'i' : '' }
          />
        </div>
      ) :
      (
        <div>
          <Field
            name="rightOperand"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            supportDataElement
          />
          <NoConversionReminder operator={ props.operator } value={ props.rightOperand } />
        </div>
      );
  }

  return null;
};

const ValueComparison = props => (
  <div>
    <div className="u-gapBottom">
      Return true if
    </div>
    <div className="u-gapBottom">
      <Field
        name="leftOperand"
        component={ DecoratedInput }
        inputComponent={ Textfield }
        supportDataElement
      />
      <NoConversionReminder operator={ props.operator } value={ props.leftOperand } />
    </div>
    <div className="u-gapBottom">
      <Field
        name="operator"
        className="u-gapRight"
        component={ Select }
        options={ operatorOptions }
      />
      {
        operatorMeta[props.operator].isCaseSensitivitySupported ?
          (
            <Field
              name="caseInsensitive"
              component={ Checkbox }
            >
              Case Insensitive
            </Field>
          ) : null
      }
    </div>
    <div>
      <RightOperandFields { ...props } />
    </div>
  </div>
);

const valueSelector = formValueSelector('default');
const stateToProps = state => ({
  operator: valueSelector(state, 'operator'),
  caseInsensitive: valueSelector(state, 'caseInsensitive'),
  leftOperand: valueSelector(state, 'leftOperand'),
  rightOperand: valueSelector(state, 'rightOperand')
});

export default connect(stateToProps)(ValueComparison);

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      leftOperand: settings.leftOperand || '',
      operator: (settings.comparison && settings.comparison.operator) || operators.EQUALS,
      caseInsensitive: Boolean(settings.comparison && settings.comparison.caseInsensitive),
      rightOperand: settings.rightOperand || ''
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings,
      leftOperand: values.leftOperand,
      comparison: {
        operator: values.operator
      }
    };

    if (operatorMeta[values.operator].isCaseSensitivitySupported && values.caseInsensitive) {
      settings.comparison.caseInsensitive = values.caseInsensitive;
    }

    if (operatorMeta[values.operator].isRightOperandSupported) {
      settings.rightOperand = values.rightOperand;
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.operator) {
      const meta = operatorMeta[values.operator];

      if (meta.isOperandLengthRequired) {
        if (!values.leftOperand) {
          errors.leftOperand = 'Please specify a value.';
        }

        if (meta.isRightOperandSupported && !values.rightOperand) {
          errors.rightOperand = 'Please specify a value.';
        }
      }
    }

    return errors;
  }
};
