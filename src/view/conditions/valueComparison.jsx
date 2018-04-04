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
import {isDataElementToken, isNumberLike} from '../utils/validators';

const operators = {
  EQUALS: 'equals',
  CONTAINS: 'contains',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
  MATCHES_REGEX: 'matchesRegex',
  LESS_THAN: 'lessThan',
  LESS_THAN_OR_EQUAL: 'lessThanOrEqual',
  GREATER_THAN: 'greaterThan',
  GREATER_THAN_OR_EQUAL: 'greaterThanOrEqual',
  IS_TRUE: 'isTrue',
  IS_TRUTHY: 'isTruthy'
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
  [operators.CONTAINS]: {
    label: 'Contains',
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
  [operators.ENDS_WITH]: {
    label: 'Ends With',
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
  }
};

const operatorOptions = Object.keys(metaByOperator).map(operator => (
  {
    value: operator,
    label: metaByOperator[operator].label
  }
));

const NoTypeConversionReminder = (props) => {
  const sketchyStrings = [
    'true',
    'false',
    'null',
    'undefined'
  ];

  return props.operator === operators.EQUALS &&
    sketchyStrings.indexOf(props.value.toLowerCase()) !== -1 ?
    (
      <Alert className="u-block" variant="warning">
        Be aware that the value &quot;{props.value}&quot; will be compared as a string.
      </Alert>
    ) : null;
};

const RightOperandFields = (props) => {
  if (metaByOperator[props.operator].supportsRightOperand) {
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
          <NoTypeConversionReminder operator={ props.operator } value={ props.rightOperand } />
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
    </div>
    <div className="u-gapBottom">
      <Field
        name="operator"
        className="u-gapRight"
        component={ Select }
        options={ operatorOptions }
      />
      {
        metaByOperator[props.operator].supportsCaseSensitivity ?
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
const stateToProps = state => valueSelector(state,
  'operator',
  'caseInsensitive',
  'leftOperand',
  'rightOperand'
);

export default connect(stateToProps)(ValueComparison);

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      leftOperand: String(settings.leftOperand || ''),
      operator: (settings.comparison && settings.comparison.operator) || operators.EQUALS,
      caseInsensitive: Boolean(settings.comparison && settings.comparison.caseInsensitive),
      rightOperand: String(settings.rightOperand || '')
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
