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

import clientInfo from './helpers/clientInfo';

/**
 * Browser condition. Determines if the actual browser matches at least one acceptable browser.
 * @param {Object} settings Condition settings.
 * @param {string[]} settings.browsers An array of acceptable browsers.
 * @returns {boolean}
 */
const browserCondition = function (settings) {
  return settings.browsers.indexOf(clientInfo.browser) !== -1;
};

export default browserCondition;
