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

import validateInjectedParams from '../../helpers/validate-injected-params';
const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;

const escapeForRegex = function (string) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
  }
  return string.replace(matchOperatorsRegex, '\\$&');
};

function injectDomainCondition({ document }) {
  /**
   * Domain condition. Determines if the actual domain matches at least one acceptable domain.
   * @param {Object} settings Condition settings.
   * @param {string[]} settings.domains An array of acceptable domains.
   * @returns {boolean}
   */
  return function domainCondition(settings) {
    const domain = document.location.hostname;
    return settings.domains.some(function (acceptableDomain) {
      return domain.match(
        new RegExp('(^|\\.)' + escapeForRegex(acceptableDomain) + '$', 'i')
      );
    });
  };
}

const validateInjection = validateInjectedParams(injectDomainCondition);

export default validateInjection({
  // runs in Turbine context, which provides the core-module "reactor-document".
  document: require('@adobe/reactor-document')
});

/* START.TESTS_ONLY */
export { validateInjection as injectDecorateDomainCondition };
/* END.TESTS_ONLY */
