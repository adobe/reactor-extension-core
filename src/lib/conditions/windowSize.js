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

import document from '@adobe/reactor-document';
import compareNumbers from './helpers/compareNumbers';

/**
 * Window size condition. Determines if the current window size matches constraints.
 * @param {Object} settings Condition settings.
 * @param {number} settings.width The window width to compare against.
 * @param {comparisonOperator} settings.widthOperator The comparison operator to use
 * to compare against width.
 * @param {number} settings.height The window height to compare against.
 * @param {comparisonOperator} settings.heightOperator The comparison operator to use
 * to compare against height.
 * @returns {boolean}
 */
const windowSizeCondition = function (settings) {
  const widthInRange = compareNumbers(
    document.documentElement.clientWidth,
    settings.widthOperator,
    settings.width
  );
  const heightInRange = compareNumbers(
    document.documentElement.clientHeight,
    settings.heightOperator,
    settings.height
  );
  return widthInRange && heightInRange;
};

export default windowSizeCondition;
