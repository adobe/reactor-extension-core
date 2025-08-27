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

import window from '@adobe/reactor-window';
import queryString from '@adobe/reactor-query-string';
import textMatch from '../helpers/textMatch';

/**
 * Query string parameter condition. Determines if a query string parameter exists with a name and
 * value that matches the acceptable name and value.
 * @param {Object} settings Condition settings.
 * @param {string} settings.name The name of the query string parameter.
 * @param {string} settings.queryParams Acceptable query string parameters to match.
 * @param {string} settings.queryParams[].value An acceptable query string parameter value.
 * @param {boolean} [settings.queryParams[].valueIsRegex=false] Whether <code>settings.value</code>
 * is intended to be a regular expression.
 * @returns {boolean}
 */
const queryStringParameterCondition = function (settings) {
  const queryParams = queryString.parse(window.location.search);
  if (!queryParams.hasOwnProperty(settings.name)) {
    return false;
  }

  let queryParamValues;
  if (!Array.isArray(settings.queryParams)) {
    // legacy support
    queryParamValues = [
      { value: settings.value, valueIsRegex: Boolean(settings.valueIsRegex) }
    ];
  } else {
    queryParamValues = settings.queryParams;
  }

  const queryParamValue = queryParams[settings.name];
  return queryParamValues.some(function (acceptableQueryParamValue) {
    const acceptableValue = acceptableQueryParamValue.valueIsRegex
      ? new RegExp(acceptableQueryParamValue.value, 'i')
      : acceptableQueryParamValue.value;

    return textMatch(queryParamValue, acceptableValue);
  });
};

export default queryStringParameterCondition;
