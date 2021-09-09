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

import ReplacementValue, {
  formConfig as replacementValueFormConfig
} from './replacementValue';
import RegexMatch, { formConfig as regexMatchFormConfig } from './regexMatch';
import mergeFormConfigs from '../../../utils/mergeFormConfigs';

export default ({ caseInsensitive }) => {
  return (
    <>
      <RegexMatch caseInsensitive={caseInsensitive} />
      <ReplacementValue />
    </>
  );
};

export const formConfig = mergeFormConfigs(
  regexMatchFormConfig,
  replacementValueFormConfig
);
