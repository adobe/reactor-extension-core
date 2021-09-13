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

'use strict';

var stringAndNumberUtils = require('../helpers/stringAndNumberUtils');
var isString = stringAndNumberUtils.isString;
var castToStringIfNumber = stringAndNumberUtils.castToStringIfNumber;

/**
 * The javascript tools data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.operator The attribute that contains the desired operation.
 * @returns {string}
 */
module.exports = function (settings) {
  var value = settings.sourceValue;

  switch (settings.operator) {
    case 'simpleReplace':
      value = castToStringIfNumber(value);

      if (!isString(value)) {
        return value;
      }

      var method = settings.replaceAll === true ? 'replaceAll' : 'replace';
      return value[method](settings.searchValue, settings.replacementValue);

    case 'regexReplace':
      value = castToStringIfNumber(value);

      if (!isString(value)) {
        return value;
      }

      var re = new RegExp(
        settings.regexInput,
        (settings.caseInsensitive === true ? 'i' : '') +
          (settings.replaceAll === true ? 'g' : '')
      );

      return value.replace(re, settings.replacementValue);

    case 'substring':
      value = castToStringIfNumber(value);

      if (!isString(value)) {
        return value;
      }

      return value.substring(
        settings.start,
        settings.end != null ? settings.end : undefined
      );

    case 'regexMatch':
      value = castToStringIfNumber(value);

      if (!isString(value)) {
        return value;
      }

      var re = new RegExp(
        settings.regexInput,
        settings.caseInsensitive ? 'i' : ''
      );

      return value.match(re)[0];

    case 'length':
      if (!Array.isArray(value) && !isString(value)) {
        return 0;
      }

      return value.length;

    case 'slice':
      value = castToStringIfNumber(value);

      if (!Array.isArray(value) && !isString(value)) {
        return value;
      }

      return value.slice(
        settings.start,
        settings.end != null ? settings.end : undefined
      );

    case 'indexOf':
    case 'lastIndexOf':
      value = castToStringIfNumber(value);

      if (!isString(value)) {
        return value;
      }

      return value[settings.operator](settings.searchValue);

    case 'join':
      if (!Array.isArray(value)) {
        return value;
      }
      return value.join(settings.delimiter);

    case 'split':
      value = castToStringIfNumber(value);

      if (!isString(value)) {
        return value;
      }

      return value.split(settings.delimiter);

    case 'arrayPop':
      if (!Array.isArray(value)) {
        return value;
      }
      return value.pop();

    case 'arrayShift':
      if (!Array.isArray(value)) {
        return value;
      }
      return value.shift();
  }
};
