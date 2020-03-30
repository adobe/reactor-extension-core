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
import { connect } from 'react-redux';
import Textfield from '@react/react-spectrum/Textfield';
import Checkbox from '@react/react-spectrum/Checkbox';
import { formValueSelector } from 'redux-form';
import { Toast } from '@react/react-spectrum/Toast';
import Select from '@react/react-spectrum/Select';
import RegexTestButton from '../components/regexTestButton';
import WrappedField from '../components/wrappedField';
import { isDataElementToken, isNumberLike } from '../utils/validators';

const operators = {
  EQUALS: 'equals',
  DOES_NOT_EQUAL: 'doesNotEqual',
  CONTAINS: 'contains',
  DOES_NOT_CONTAIN: 'doesNotContain',
  STARTS_WITH: 'startsWith',
  DOES_NOT_START_WITH: 'doesNotStartWith',
  ENDS_WITH: 'endsWith',
  DOES_NOT_END_WITH: 'doesNotEndWith',
  MATCHES_REGEX: 'matchesRegex',
  DOES_NOT_MATCH_REGEX: 'doesNotMatchRegex',
  LESS_THAN: 'lessThan',
  LESS_THAN_OR_EQUAL: 'lessThanOrEqual',
  GREATER_THAN: 'greaterThan',
  GREATER_THAN_OR_EQUAL: 'greaterThanOrEqual',
  IS_TRUE: 'isTrue',
  IS_TRUTHY: 'isTruthy',
  IS_FALSE: 'isFalse',
  IS_FALSY: 'isFalsy'
};

const metaByOperator = {
  [operators.EQUALS]: {
    // We don't have isRightOperandLengthRequired set to true for the equals operator because
    // creating a comparison to determine if a value equals an empty string is a legit
    // use case.
    label: 'Equals',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    saveOperandAsNumberWhenPossible: true
  },
  [operators.DOES_NOT_EQUAL]: {
    // We don't have isRightOperandLengthRequired set to true for the doesNotEqual operator because
    // We don't have isRightOperandLengthRequired set to true for the doesNotEqual operator because
    // creating a comparison to determine if a value does not equal an empty string is a legit
    // use case.
    label: 'Does Not Equal',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    saveOperandAsNumberWhenPossible: true
  },
  [operators.CONTAINS]: {
    label: 'Contains',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.DOES_NOT_CONTAIN]: {
    label: 'Does Not Contain',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.STARTS_WITH]: {
    label: 'Starts With',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.DOES_NOT_START_WITH]: {
    label: 'Does Not Start With',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.ENDS_WITH]: {
    label: 'Ends With',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.DOES_NOT_END_WITH]: {
    label: 'Does Not End With',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.MATCHES_REGEX]: {
    label: 'Matches Regex',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.DOES_NOT_MATCH_REGEX]: {
    label: 'Does Not Match Regex',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.LESS_THAN]: {
    label: 'Is Less Than',
    supportsRightOperand: true,
    saveOperandAsNumberWhenPossible: true,
    rightOperandMustBeNumberOrDataElement: true
  },
  [operators.LESS_THAN_OR_EQUAL]: {
    label: 'Is Less Than Or Equal To',
    supportsRightOperand: true,
    saveOperandAsNumberWhenPossible: true,
    rightOperandMustBeNumberOrDataElement: true
  },
  [operators.GREATER_THAN]: {
    label: 'Is Greater Than',
    supportsRightOperand: true,
    saveOperandAsNumberWhenPossible: true,
    rightOperandMustBeNumberOrDataElement: true
  },
  [operators.GREATER_THAN_OR_EQUAL]: {
    label: 'Is Greater Than Or Equal To',
    supportsRightOperand: true,
    saveOperandAsNumberWhenPossible: true,
    rightOperandMustBeNumberOrDataElement: true
  },
  [operators.IS_TRUE]: {
    label: 'Is True'
  },
  [operators.IS_TRUTHY]: {
    label: 'Is Truthy'
  },
  [operators.IS_FALSE]: {
    label: 'Is False'
  },
  [operators.IS_FALSY]: {
    label: 'Is Falsy'
  }
};

const operatorOptions = Object.keys(metaByOperator).map(operator => (
  {
    value: operator,
    label: metaByOperator[operator].label
  }
));

const NoTypeConversionReminder = ({ operator, value }) => {
  const sketchyStrings = [
    'true',
    'false',
    'null',
    'undefined'
  ];

  return (operator === operators.EQUALS || operator === operators.DOES_NOT_EQUAL) &&
    sketchyStrings.indexOf(value.toLowerCase()) !== -1 ?
    (
      <Toast className="u-gapTop" variant="warning">
        Be aware that the value &quot;
        {value}
&quot; will be compared as a string.
      </Toast>
    ) : null;
};

const RightOperandFields = ({ operator, caseInsensitive, rightOperand }) => {
  if (metaByOperator[operator].supportsRightOperand) {
    return operator === operators.MATCHES_REGEX ||
      operator === operators.DOES_NOT_MATCH_REGEX ?
      (
        <div>
          <WrappedField
            name="rightOperand"
            className="u-gapRight"
            component={Textfield}
            componentClassName="u-fieldLong"
            supportDataElement
          />
          <WrappedField
            name="rightOperand"
            className="u-gapRight"
            component={RegexTestButton}
            flags={caseInsensitive ? 'i' : ''}
          />
        </div>
      ) :
      (
        <div>
          <WrappedField
            name="rightOperand"
            component={Textfield}
            componentClassName="u-fieldLong"
            supportDataElement
          />
          <NoTypeConversionReminder operator={operator} value={rightOperand} />
        </div>
      );
  }

  return null;
};

const ValueComparison = ({ operator, ...rest }) => (
  <div>
    <div className="u-gapBottom">
      Return true if
    </div>
    <div className="u-gapBottom">
      <WrappedField
        name="leftOperand"
        component={Textfield}
        componentClassName="u-fieldLong"
        supportDataElement
      />
    </div>
    <div className="u-gapBottom">
      <WrappedField
        name="operator"
        className="u-gapRight"
        component={Select}
        componentClassName="u-fieldLong"
        options={operatorOptions}
      />
      {
        metaByOperator[operator].supportsCaseSensitivity ?
          (
            <WrappedField
              name="caseInsensitive"
              component={Checkbox}
            >
              Case Insensitive
            </WrappedField>
          ) : null
      }
    </div>
    <div>
      <RightOperandFields operator={operator} {...rest} />
    </div>
  </div>
);

const valueSelector = formValueSelector('default');
const stateToProps = state => valueSelector(state,
  'operator',
  'caseInsensitive',
  'leftOperand',
  'rightOperand');

export default connect(stateToProps)(ValueComparison);

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      leftOperand: settings.leftOperand || '',
      operator: (settings.comparison && settings.comparison.operator) || operators.EQUALS,
      caseInsensitive: Boolean(settings.comparison && settings.comparison.caseInsensitive),
      rightOperand: settings.rightOperand !== undefined ? String(settings.rightOperand) : ''
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

    const operatorMeta = metaByOperator[values.operator];

    if (operatorMeta.supportsCaseSensitivity && values.caseInsensitive) {
      settings.comparison.caseInsensitive = values.caseInsensitive;
    }

    if (operatorMeta.supportsRightOperand) {
      settings.rightOperand =
        operatorMeta.saveOperandAsNumberWhenPossible && isNumberLike(values.rightOperand) ?
          Number(values.rightOperand) :
          String(values.rightOperand);
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!isDataElementToken(values.leftOperand)) {
      errors.leftOperand = 'Please specify a data element';
    }

    if (values.operator) {
      const operatorMeta = metaByOperator[values.operator];

      if (operatorMeta.rightOperandMustBeNonEmptyString && !values.rightOperand) {
        errors.rightOperand = 'Please specify a value';
      }

      if (operatorMeta.rightOperandMustBeNumberOrDataElement &&
        !isNumberLike(values.rightOperand) &&
        !isDataElementToken(values.rightOperand)) {
        errors.rightOperand = 'Please specify a number or data element';
      }
    }

    return errors;
  }
};
