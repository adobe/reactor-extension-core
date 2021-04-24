/***************************************************************************************
 * (c) 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

/**
 * The launch environment data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.operator The attribute that contains the desired operation.
 * @returns {string}
 */
module.exports = function (settings) {
      switch (settings.operator) {
        case 'substring':
          return settings.sourceValue.substring((settings.stringStart!=''?settings.stringStart:undefined),(settings.stringEnd!=''?settings.stringEnd:undefined));
        case 'join':
          return settings.sourceValue.join(settings.delimiter);
        case 'split':
          return settings.sourceValue.split(settings.delimiter);
        case 'regexReplace':
          var re = new RegExp(settings.regexInput, (settings.caseInsensitive?"i":"")+(settings.replaceAll?"g":""));
          return (settings.replaceAll?settings.sourceValue.replaceAll(re, settings.replacement):settings.sourceValue.replace(re, settings.replacement));
        case 'simpleReplace':
          return (settings.replaceAll?settings.sourceValue.replaceAll(settings.search, settings.replacement):settings.sourceValue.replace(settings.search, settings.replacement));
        case 'regexMatch':
          var re = new RegExp(settings.regexInput, (settings.caseInsensitive?"i":""));
          return settings.sourceValue.match(re)[1];
        case 'eval':
          return eval(settings.sourceCode);
        case 'capitalizeValue':
          return settings.sourceValue.charAt(0).toUpperCase() + settings.sourceValue.slice(1);;
        case 'uppercaseValue':
          return settings.sourceValue.toUpperCase();
        case 'lowercaseValue':
          return settings.sourceValue.toLowerCase();
      }
};