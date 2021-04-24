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
 import { TextField, Checkbox, Picker, Item, Flex } from '@adobe/react-spectrum';
 import { formValueSelector } from 'redux-form';
 import RegexTestButton from '../components/regexTestButton';
 import WrappedField from '../components/wrappedField';
 import NoWrapText from '../components/noWrapText';
 import EditorButton from '../components/editorButton';
 import { isDataElementToken, isNumberLike } from '../utils/validators';
 
 const operators = {
  CAPITALIZE_VALUE: 'capitalizeValue',
  UPPERCASE_VALUE: 'uppercaseValue',
  LOWERCASE_VALUE: 'lowercaseValue',
  SUBSTRING: 'substring',
  JOIN: 'join',
  SPLIT: 'split',
  REGEX_REPLACE: 'regexReplace',
  SIMPLE_REPLACE: 'simpleReplace',
  REGEX_MATCH: 'regexMatch',
  EVAL: "eval"
 };
 
 const metaByOperator = {
  [operators.CAPITALIZE_VALUE]: {
    label: 'Capitalize Value'
  },
  [operators.UPPERCASE_VALUE]: {
    label: 'Uppercase Value'
  },
  [operators.LOWERCASE_VALUE]: {
    label: 'Lowercase Value'
  },
  [operators.SIMPLE_REPLACE]: {
    label: 'Simple Replace',
    requiresSearchValue: true,
    supportsReplacement: true
  },
  [operators.REGEX_REPLACE]: {
    label: 'Regex Replace',
    requiresRegex: true,
    supportsReplacement: true
  },
  [operators.SUBSTRING]: {
     label: 'Substring',
     requiresMin: true,
     requiresMax: true
   },
   [operators.JOIN]: {
     label: 'Join Array',
     requiresDelimiter: true
   },
   [operators.SPLIT]: {
     label: 'Split to Array',
     requiresDelimiter: true
   },
   [operators.REGEX_MATCH]: {
     label: 'Extract Value with Regex',
     requiresRegex: true
   },
   [operators.EVAL]: {
     label: 'Eval',
     requiresCode: true
   }
 };
 
 const operatorOptions = Object.keys(metaByOperator).map((operator) => ({
   id: operator,
   name: metaByOperator[operator].label
 }));
 
 const RegexFields = ({ operator, caseInsensitive }) => {
   if (metaByOperator[operator].requiresRegex) {
     return (<>
       <Flex gap="size-100">
         <WrappedField
           label="Regex Expression"
           name="regexInput"
           component={TextField}
           width="size-3000"
           isRequired
         />
        <WrappedField
          minWidth="size-2000"
          name="caseInsensitive"
          component={Checkbox}
        >
          Case Insensitive
        </WrappedField>
        <WrappedField
           name="regexInput"
           component={RegexTestButton}
           flags={caseInsensitive ? 'i' : ''}
         />
       </Flex>
    </>)
   }
   return null;
 };
 
 const OtherFields = ({ operator }) => {
  if (metaByOperator[operator].requiresDelimiter) {
   return (<>
       <WrappedField
         label="Value Separator"
         name="delimiter"
         component={TextField}
         width="size-1000"
         isRequired
       />
  </>)
 }
 if (metaByOperator[operator].supportsReplacement && !metaByOperator[operator].requiresSearchValue) {
   return (<>
   <Flex gap="size-100">
       <WrappedField
         label="Replacement Value"
         name="replacement"
         component={TextField}
         width="size-3000"
         supportDataElement
       />
        <WrappedField
          minWidth="size-2000"
          name="replaceAll"
          component={Checkbox}
        >
          Replace all
        </WrappedField>
  </Flex>
  </>)
 }
 if (metaByOperator[operator].supportsReplacement && metaByOperator[operator].requiresSearchValue) {
  return (<>
     <WrappedField
        label="Search Value"
        name="search"
        component={TextField}
        width="size-3000"
        supportDataElement
      />
    <Flex gap="size-100">
      <WrappedField
        label="Replacement Value"
        name="replacement"
        component={TextField}
        width="size-3000"
        supportDataElement
      />
        <WrappedField
          minWidth="size-2000"
          name="replaceAll"
          component={Checkbox}
        >
          Replace all
        </WrappedField>
      </Flex>
 </>)
}
 if (metaByOperator[operator].requiresMax) {
  return (<>
  <Flex gap="size-100">
      <WrappedField
        label="Start Position"
        name="stringStart"
        component={TextField}
        width="size-1000"
      />
      <WrappedField
        label="End Position"
        name="stringEnd"
        component={TextField}
        width="size-1000"
      />
  </Flex>
 </>)
}

  return null;
};

 const JSTools = ({ operator, ...rest }) => {
  if (metaByOperator[operator].requiresCode) {
    return (<>
    <NoWrapText>Apply simple JavaScript Operations</NoWrapText>
      <Flex gap="size-100">
       <WrappedField
         width="size-3000"
         name="operator"
         label="Function"
         component={Picker}
         items={operatorOptions}
       >
         {(item) => <Item>{item.name}</Item>}
       </WrappedField>
       <WrappedField name="sourceCode" component={EditorButton} />
     </Flex>
   </>)
  }
  else{
    return(
   <Flex gap="size-100" direction="column">
    <NoWrapText>Apply simple JavaScript Operations</NoWrapText>
    <WrappedField
         width="size-3000"
         name="operator"
         label="Function"
         component={Picker}
         items={operatorOptions}
       >
         {(item) => <Item>{item.name}</Item>}
       </WrappedField>
     <WrappedField
       minWidth="size-3000"
       label="Source Value"
       name="sourceValue"
       component={TextField}
       isRequired
       supportDataElement
     /> 
     <RegexFields operator={operator} {...rest} />
     <OtherFields operator={operator} {...rest} />
   </Flex>)
  }
 };
 
 const valueSelector = formValueSelector('default');
 const stateToProps = (state) =>
   valueSelector(
     state,
     'operator',
     'caseInsensitive'
   );
 
 export default connect(stateToProps)(JSTools);
 
 export const formConfig = {
   settingsToFormValues(values, settings) {
     return {
       ...values,
       sourceValue: settings.sourceValue || '',
       regexInput: settings.regexInput || '',
       search: settings.search || '',
       operator: settings.operator || 'capitalizeValue',
       stringStart: settings.stringStart || '',
       stringEnd: settings.stringEnd || '',
       replacement: settings.replacement || '',
       delimiter: settings.delimiter || '',
       caseInsensitive: settings.caseInsensitive || '',
       sourceCode: settings.sourceCode || '',
       replaceAll: settings.replaceAll || '',
     };
   },
   formValuesToSettings(settings, values) {
     settings = {
       ...settings,
       sourceValue: values.sourceValue,
       operator: values.operator
     };
 
     const operatorMeta = metaByOperator[values.operator];
 
     if (operatorMeta.requiresRegex && values.caseInsensitive) {
       settings.caseInsensitive = values.caseInsensitive;
     }
 
     if (operatorMeta.requiresRegex) {
      settings.regexInput = values.regexInput;
    }

     if (operatorMeta.requiresDelimiter) {
       settings.delimiter = values.delimiter;
     }

     if (operatorMeta.supportsReplacement) {
      settings.replacement = values.replacement;
      settings.replaceAll = values.replaceAll;
    }

    if (operatorMeta.requiresSearchValue) {
      settings.search = values.search;
    }

    if (operatorMeta.requiresCode) {
      settings.sourceCode = values.sourceCode;
    }

    if (operatorMeta.requiresMin && operatorMeta.requiresMax) {
      settings.stringStart = values.stringStart;
      settings.stringEnd = values.stringEnd;
    }
 
     return settings;
   },
   validate(errors, values) {
     errors = {
       ...errors
     };
 
     if (!isDataElementToken(values.sourceValue)) {
       errors.sourceValue = 'Please specify a data element';
     }
 
     if (values.operator) {
       const operatorMeta = metaByOperator[values.operator];
 
       if (
         operatorMeta.requiresRegex &&
         !values.regexInput
       ) {
         errors.regexInput = 'Please specify a regex expression';
       }

       if (
        operatorMeta.requiresDelimiter &&
        !values.delimiter
      ) {
        errors.delimiter = 'Please specify a delimiter';
      }

      if (
        operatorMeta.requiresSearchValue &&
        !values.search
      ) {
        errors.search = 'Please specify a value to search for';
      }

      if (
        operatorMeta.requiresCode &&
        (!values.sourceCode || values.sourceCode.length>500)
      ) {
        errors.sourceCode = 'Please specify a script no longer than 500 characters';
      }
 
       if (
         operatorMeta.requiresMin && operatorMeta.requiresMax
       ) {
        if (values.stringStart && !isNumberLike(values.stringStart)) {
          errors.stringStart = 'Please specify a number';
        }
        if (values.stringEnd && !isNumberLike(values.stringEnd)) {
          errors.stringEnd = 'Please specify a number';
        }
       }
     }
 
     return errors;
   }
 };
 