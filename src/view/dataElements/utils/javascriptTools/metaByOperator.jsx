/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from 'react';
import operators from './operators';
import RegexMatch from '../../components/javascriptTools/regexMatch';
import RegexReplace from '../../components/javascriptTools/regexReplace';
import ValueSeparator from '../../components/javascriptTools/valueSeparator';
import SimpleReplace from '../../components/javascriptTools/simpleReplace';
import SearchValue from '../../components/javascriptTools/searchValue';
import StartEndPosition from '../../components/javascriptTools/startEndPosition';

export default {
  [operators.SIMPLE_REPLACE]: {
    label: 'Simple Replace',
    componentFn: () => <SimpleReplace />
  },
  [operators.REGEX_REPLACE]: {
    label: 'Regex Replace',
    componentFn: ({ caseInsensitive }) => (
      <RegexReplace caseInsensitive={caseInsensitive} />
    )
  },
  [operators.SUBSTRING]: {
    label: 'Substring',
    componentFn: () => <StartEndPosition />
  },
  [operators.REGEX_MATCH]: {
    label: 'Extract Value with Regex',
    componentFn: ({ caseInsensitive }) => (
      <RegexMatch caseInsensitive={caseInsensitive} />
    )
  },
  [operators.LENGTH]: {
    label: 'Length of String or Array'
  },
  [operators.INDEX_OF]: {
    label: 'First index of character in string',
    componentFn: () => <SearchValue />
  },
  [operators.LAST_INDEX_OF]: {
    label: 'Last index of character in string',
    componentFn: () => <SearchValue />
  },
  [operators.JOIN]: {
    label: 'Join Array',
    componentFn: () => <ValueSeparator />
  },
  [operators.SPLIT]: {
    label: 'Split to Array',
    componentFn: () => <ValueSeparator />
  },
  [operators.ARRAY_POP]: {
    label: 'Array Pop'
  },
  [operators.ARRAY_SHIFT]: {
    label: 'Array Shift'
  },
  [operators.SLICE]: {
    label: 'Array or String Slice',
    componentFn: () => <StartEndPosition />
  }
};
